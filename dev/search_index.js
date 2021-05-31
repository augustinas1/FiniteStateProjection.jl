var documenterSearchIndex = {"docs":
[{"location":"index.html#FiniteStateProjection.jl-Documentation","page":"FiniteStateProjection.jl Documentation","title":"FiniteStateProjection.jl Documentation","text":"","category":"section"},{"location":"index.html","page":"FiniteStateProjection.jl Documentation","title":"FiniteStateProjection.jl Documentation","text":"CurrentModule=FiniteStateProjection","category":"page"},{"location":"index.html#Introduction","page":"FiniteStateProjection.jl Documentation","title":"Introduction","text":"","category":"section"},{"location":"index.html","page":"FiniteStateProjection.jl Documentation","title":"FiniteStateProjection.jl Documentation","text":"FiniteStateProjection.jl is a package that implements Finite State Projection algorithms for chemical reaction networks based on Catalyst.jl and ModelingToolkit. FiniteStateProjection.jl converts descriptions of reaction networks into ODEProblems that can be used to compute approximate solutions of the Chemical Master Equation with packages such as DifferentialEquations.jl.","category":"page"},{"location":"index.html","page":"FiniteStateProjection.jl Documentation","title":"FiniteStateProjection.jl Documentation","text":"FiniteStateProjection.jl works by converting a ReactionSystem into a function that computes the right-hand side of the Chemical Master Equation:","category":"page"},{"location":"index.html","page":"FiniteStateProjection.jl Documentation","title":"FiniteStateProjection.jl Documentation","text":"fracmathrmdmathrmd t P(t) = A P(t)","category":"page"},{"location":"index.html","page":"FiniteStateProjection.jl Documentation","title":"FiniteStateProjection.jl Documentation","text":"This function is generated dynamically via build_rhs and specialised for each ReactionSystem. Users can use their preferred array types supporting CartesianIndices and provide additional features by overloading these functions.","category":"page"},{"location":"index.html#Features:","page":"FiniteStateProjection.jl Documentation","title":"Features:","text":"","category":"section"},{"location":"index.html","page":"FiniteStateProjection.jl Documentation","title":"FiniteStateProjection.jl Documentation","text":"Flexible API for user-defined array types\nAutomatic dimensionality reduction for systems with conserved quantities\nOn-the-fly generation of specialised functions for improved performance","category":"page"},{"location":"index.html#Examples","page":"FiniteStateProjection.jl Documentation","title":"Examples","text":"","category":"section"},{"location":"index.html#Birth-Death-Model","page":"FiniteStateProjection.jl Documentation","title":"Birth-Death Model","text":"","category":"section"},{"location":"index.html","page":"FiniteStateProjection.jl Documentation","title":"FiniteStateProjection.jl Documentation","text":"This example models a linear birth-death process. The reaction network is easily defined using Catalyst.jl. Our truncated state space has length 50, which is enough for this simple system.","category":"page"},{"location":"index.html","page":"FiniteStateProjection.jl Documentation","title":"FiniteStateProjection.jl Documentation","text":"This system has no conserved quantities, so we use a NaiveIndexHandler to map from a one-dimensional array with offset 1 to the state of the system. See Index Handlers for more details.","category":"page"},{"location":"index.html","page":"FiniteStateProjection.jl Documentation","title":"FiniteStateProjection.jl Documentation","text":"using FiniteStateProjection, DifferentialEquations\n\n@parameters r1, r2\nrs = @reaction_network begin\n    r1, 0 --> A\n    r2, A --> 0\nend r1 r2\n\nsys = FSPSystem(rs)\n\n# Parameters for our system\nps = [ 10.0, 1.0 ]\n\n# Initial values\nu0 = zeros(50)\nu0[1] = 1.0\n\nprob = convert(ODEProblem, NaiveIndexHandler(sys, 1), sys, u0, 10.0, ps)\nsol = solve(prob, Vern7(), atol=1e-6)","category":"page"},{"location":"index.html","page":"FiniteStateProjection.jl Documentation","title":"FiniteStateProjection.jl Documentation","text":"(Image: Visualisation)","category":"page"},{"location":"index.html#Telegraph-Model","page":"FiniteStateProjection.jl Documentation","title":"Telegraph Model","text":"","category":"section"},{"location":"index.html","page":"FiniteStateProjection.jl Documentation","title":"FiniteStateProjection.jl Documentation","text":"Here we showcase the telegraph model, a simplistic description of mRNA transcription in biological cells. We have one gene that transitions stochastically between an on and an off state and produces mRNA molecules while it is in the on state.","category":"page"},{"location":"index.html","page":"FiniteStateProjection.jl Documentation","title":"FiniteStateProjection.jl Documentation","text":"This system technically consists of three different species, namely the two states of the gene and mRNA. It is clear, however, that these are not independent as D_on(t) + D_off(t) = 1. In order to solve the Chemical Master Equation we can therefore recover D_off(t) from the other variables and the entire state of the system is described by only two variables: D_on(t) and M(t), as well as the total number of genes, which is a constant equal to 1. The default index handler class DefaultIndexHandler does this for us automatically and maps the state of the system to a two-dimensional array. This showcases that we can often reduce the number of species in the system to make it easier to solve numerically.","category":"page"},{"location":"index.html","page":"FiniteStateProjection.jl Documentation","title":"FiniteStateProjection.jl Documentation","text":"using FiniteStateProjection, DifferentialEquations\n\n@parameters r1 r2 r3 r4\nrs = @reaction_network begin\n    r1, G_on --> G_on + M\n    (r2, r3), G_on <--> G_off\n    r4, M --> 0\nend r1 r2 r3 r4\n\nsys = FSPSystem(rs)\n\n# There is one conserved quantity: G_on + G_off\ncons = conservedquantities([1,0,0], sys)\n\n# Parameters for our system\nps = [ 15.0, 0.25, 0.15, 1.0 ]\n\n# Since G_on + G_off = const. we do not have to model the latter separately\nu0 = zeros(2, 50)\nu0[1,1] = 1.0\n\nprob = convert(ODEProblem, DefaultIndexHandler(sys, 1), sys, u0, 10.0, (ps, cons))\nsol = solve(prob, Vern7(), atol=1e-6)","category":"page"},{"location":"index.html","page":"FiniteStateProjection.jl Documentation","title":"FiniteStateProjection.jl Documentation","text":"(Image: Visualisation)","category":"page"},{"location":"index.html#FSP-Basics","page":"FiniteStateProjection.jl Documentation","title":"FSP Basics","text":"","category":"section"},{"location":"index.html","page":"FiniteStateProjection.jl Documentation","title":"FiniteStateProjection.jl Documentation","text":"FSPSystem\nconservationlaws\nconservedquantities","category":"page"},{"location":"index.html#FiniteStateProjection.FSPSystem","page":"FiniteStateProjection.jl Documentation","title":"FiniteStateProjection.FSPSystem","text":"struct FSPSystem\n    rs::ReactionSystem\n    cons_laws::Matrix{Int}\n\nend\n\nThin wrapper around ReactionSystem for use with this package.\n\nConstructor: FSPSystem(rs::ReactionSystem)\n\n\n\n\n\n","category":"type"},{"location":"index.html#FiniteStateProjection.conservationlaws","page":"FiniteStateProjection.jl Documentation","title":"FiniteStateProjection.conservationlaws","text":"conservationlaws(netstoichmat::AbstractMatrix{Int})::Matrix{Int}\n\nGiven the net stoichiometry matrix of a reaction system, computes a matrix of conservation laws. Each row contains the stoichiometric coefficients of a different conserved quantity.\n\n\n\n\n\nconservationlaws(sys::FSPSystem)::Matrix{Int}\n\nReturns conservation laws associated with the system.\n\n\n\n\n\n","category":"function"},{"location":"index.html#FiniteStateProjection.conservedquantities","page":"FiniteStateProjection.jl Documentation","title":"FiniteStateProjection.conservedquantities","text":"conservedquantities(state, sys::FSPSystem)\n\nCompute conserved quantities for the system at the given state.\n\n\n\n\n\n","category":"function"},{"location":"index.html#Index-Handlers","page":"FiniteStateProjection.jl Documentation","title":"Index Handlers","text":"","category":"section"},{"location":"index.html","page":"FiniteStateProjection.jl Documentation","title":"FiniteStateProjection.jl Documentation","text":"The task of an index handler is to provide a mapping between the way the solution of the FSP is stored, usually a multidimensional array, and the states it represents. The standard approach is to store the states of a system with s reactions as an s-dimensional array and have the index (i_1 ldots i_s) correspond to the state (n_1 = i_1 ldots n_s = i_s). This is implemented by the class NaiveIndexHandler, which accepts an offset argument to deal with Julia's 1-based indexing (so the Julia idex (1ldots1) corresponds to the state with no molecules). For systems with conservation laws the DefaultIndexHandler class generally stores the data more efficiently and is the preferred choice.","category":"page"},{"location":"index.html","page":"FiniteStateProjection.jl Documentation","title":"FiniteStateProjection.jl Documentation","text":"User-defined index handlers should inherit from [AbstractIndexHandler] and implement the following methods:","category":"page"},{"location":"index.html","page":"FiniteStateProjection.jl Documentation","title":"FiniteStateProjection.jl Documentation","text":"getsubstitutions\nbuild_rhs_header\nsingleindices (optional)\npairedindices (optional)","category":"page"},{"location":"index.html","page":"FiniteStateProjection.jl Documentation","title":"FiniteStateProjection.jl Documentation","text":"AbstractIndexHandler\nsingleindices\npairedindices\ngetsubstitutions\nNaiveIndexHandler\nDefaultIndexHandler\nreducedspecies\nelidedspecies","category":"page"},{"location":"index.html#FiniteStateProjection.AbstractIndexHandler","page":"FiniteStateProjection.jl Documentation","title":"FiniteStateProjection.AbstractIndexHandler","text":"abstract type AbstractIndexHandler end\n\nFSP.jl splits handling of the FSP into two parts. The first defines how the CME is compute\n\nSee also: singleindices, pairedindices\n\n\n\n\n\n","category":"type"},{"location":"index.html#FiniteStateProjection.singleindices","page":"FiniteStateProjection.jl Documentation","title":"FiniteStateProjection.singleindices","text":"singleindices(idxhandler::AbstractIndexHandler, arr)\n\nReturns all indices I in arr. Defaults to CartesianIndices, but can be overloaded for arbitrary index handlers. \n\n\n\n\n\n","category":"function"},{"location":"index.html#FiniteStateProjection.pairedindices","page":"FiniteStateProjection.jl Documentation","title":"FiniteStateProjection.pairedindices","text":"pairedindices(idxhandler::AbstractIndexHandler, arr, shift::CartesianIndex)\n\nReturns all pairs of indices (I .- shift, I) in arr. The default implementation can be overloaded for arbitrary index handlers. \n\n\n\n\n\npairedindices(idxhandler::DefaultIndexHandler, arr::AbstractArray, shift::CartesianIndex)\n\nSimilar to its NaiveIndexHandler variant, but converts the indices into indices into the reduced state space array.\n\n\n\n\n\n","category":"function"},{"location":"index.html#FiniteStateProjection.getsubstitutions","page":"FiniteStateProjection.jl Documentation","title":"FiniteStateProjection.getsubstitutions","text":"getsubstitutions(idxhandler::AbstractIndexHandler, sys::FSPSystem; state_sym::Symbol)::Dict\n\nConstruct the map speciesname => expr that gives the species abundances in terms of the state variable state_sym. See NaiveIndexHandler for the default implementation.\n\nSee also: build_ratefuncs, build_rhs\n\n\n\n\n\n","category":"function"},{"location":"index.html#FiniteStateProjection.NaiveIndexHandler","page":"FiniteStateProjection.jl Documentation","title":"FiniteStateProjection.NaiveIndexHandler","text":"struct NaiveIndexHandler <: AbstractIndexHandler\n    offset::Int\nend\n\nBasic index handler that stores the state of a system with s species in an s-dimensional array. The offset parameter denotes the offset by which the array is indexed (defaults to 1 in Julia). Use OffsetArrays.jl to enable 0-based indexing.\n\nThis is the simplest index handler, but it will not be optimal if some states cannot be reached from the initial state, e.g. due to the presence of conservation laws. It is generally better to use DefaultIndexHandler, which will automatically elide species where possible.\n\nConstructors: NaiveIndexHandler([sys::FSPSystem,] offset::Int)\n\nSee also: DefaultIndexHandler\n\n\n\n\n\n","category":"type"},{"location":"index.html#FiniteStateProjection.DefaultIndexHandler","page":"FiniteStateProjection.jl Documentation","title":"FiniteStateProjection.DefaultIndexHandler","text":"struct DefaultIndexHandler <: AbstractIndexHandler\n\nMore efficient index handler that improves upon NaiveIndexHandler by eliminating variables whose abundances can be computed from other variables using conservation laws. Describes the system using a subset of the original species which can be obtained via reducedspecies. Reduces the  dimensionality of the FSP by the number of conservation laws in the system.\n\nConstructors: DefaultIndexHandler(sys::FSPSystem, offset::Int)\n\nSee also: reducedspecies, elidedspecies, NaiveIndexHandler\n\n\n\n\n\n","category":"type"},{"location":"index.html#FiniteStateProjection.reducedspecies","page":"FiniteStateProjection.jl Documentation","title":"FiniteStateProjection.reducedspecies","text":"reducedspecies(idxhandler::DefaultIndexHandler)\n\nReturn indices of reduced species.\n\nSee also: elidedspecies\n\n\n\n\n\n","category":"function"},{"location":"index.html#FiniteStateProjection.elidedspecies","page":"FiniteStateProjection.jl Documentation","title":"FiniteStateProjection.elidedspecies","text":"elidedspecies(idxhandler::DefaultIndexHandler)\n\nReturn indices of elided species.\n\nSee also: reducedspecies\n\n\n\n\n\nelidedspecies(cons_laws::AbstractMatrix{Int})::Vector\n\nReturns a list of species  s_1   which can be removed from the reaction system description using the provided matrix of conservation laws.\n\n\n\n\n\n","category":"function"},{"location":"index.html#Function-Building","page":"FiniteStateProjection.jl Documentation","title":"Function Building","text":"","category":"section"},{"location":"index.html","page":"FiniteStateProjection.jl Documentation","title":"FiniteStateProjection.jl Documentation","text":"Base.convert\nbuild_rhs\nunpackparams\nbuild_rhs_header\nbuild_ratefuncs\nbuild_rhs_firstpass\nbuild_rhs_secondpass","category":"page"},{"location":"index.html#Base.convert","page":"FiniteStateProjection.jl Documentation","title":"Base.convert","text":"convert(T, x)\n\nConvert x to a value of type T.\n\nIf T is an Integer type, an InexactError will be raised if x is not representable by T, for example if x is not integer-valued, or is outside the range supported by T.\n\nExamples\n\njulia> convert(Int, 3.0)\n3\n\njulia> convert(Int, 3.5)\nERROR: InexactError: Int64(3.5)\nStacktrace:\n[...]\n\nIf T is a AbstractFloat or Rational type, then it will return the closest value to x representable by T.\n\njulia> x = 1/3\n0.3333333333333333\n\njulia> convert(Float32, x)\n0.33333334f0\n\njulia> convert(Rational{Int32}, x)\n1//3\n\njulia> convert(Rational{Int64}, x)\n6004799503160661//18014398509481984\n\nIf T is a collection type and x a collection, the result of convert(T, x) may alias all or part of x.\n\njulia> x = Int[1, 2, 3];\n\njulia> y = convert(Vector{Int}, x);\n\njulia> y === x\ntrue\n\n\n\n\n\n","category":"function"},{"location":"index.html#FiniteStateProjection.build_rhs","page":"FiniteStateProjection.jl Documentation","title":"FiniteStateProjection.build_rhs","text":"build_rhs(idxhandler::AbstractIndexHandler, sys::FSPSystem)\n\nBuilds the function f(du,u,p,t) that defines the right-hand side of the CME,  for use in the ODE solver. If expression is true, returns an expression, else compiles the function. \n\n\n\n\n\n","category":"function"},{"location":"index.html#FiniteStateProjection.unpackparams","page":"FiniteStateProjection.jl Documentation","title":"FiniteStateProjection.unpackparams","text":"unpackparams(sys::FSPSystem, psym::Symbol)\n\nReturns code unpacking the parameters of the system from the symbol psym in the form (p1, p2, ...) = psym. This should be called in all overloads of build_rhs_header. It is assumed that the variable psym is an AbstractVector{Float64}.\n\nSee also: build_rhs_header, build_rhs\n\n\n\n\n\n","category":"function"},{"location":"index.html#FiniteStateProjection.build_rhs_header","page":"FiniteStateProjection.jl Documentation","title":"FiniteStateProjection.build_rhs_header","text":"build_rhs_header(idxhandler::DefaultIndexHandler, sys::FSPSystem)::Expr\n\nAssumes p is of the form (params, cons::AbstractVector{Int}) where params  are the system parameters and cons the conserved quantities.\n\n\n\n\n\nbuild_rhs_header(idxhandler::AbstractIndexHandler, sys::FSPSystem)::Expr\n\nReturn initialisation code for the RHS function, unpacking the parameters p supplied by DifferentialEquations. The default implementation just unpacks parameters from p.\n\nSee also: unpackparams, build_rhs\n\n\n\n\n\n","category":"function"},{"location":"index.html#FiniteStateProjection.build_ratefuncs","page":"FiniteStateProjection.jl Documentation","title":"FiniteStateProjection.build_ratefuncs","text":"build_ratefuncs(idxhandler::AbstractIndexHandler, sys::FSPSystem; \n                state_sym::Symbol, combinatoric_ratelaw::Bool)::Vector\n\nReturn the rate functions converted to Julia expressions in the state variable  state_sym. Abundances of the species are computed using getsubstitutions.\n\nSee also: getsubstitutions, build_rhs\n\n\n\n\n\n","category":"function"},{"location":"index.html#FiniteStateProjection.build_rhs_firstpass","page":"FiniteStateProjection.jl Documentation","title":"FiniteStateProjection.build_rhs_firstpass","text":"build_rhs_firstpass(sys::FSPSystem, rfs)::Expr\n\nReturn code for the first pass of the RHS function. Goes through all reactions and computes the negative part of the CME (probability flowing out of states). This is a simple array traversal and can be done in one go for all reactions.\n\nSee also: build_rhs\n\n\n\n\n\n","category":"function"},{"location":"index.html#FiniteStateProjection.build_rhs_secondpass","page":"FiniteStateProjection.jl Documentation","title":"FiniteStateProjection.build_rhs_secondpass","text":"build_rhs_secondpass(sys::FSPSystem, rfs)::Expr\n\nReturn code for the second pass of the RHS function. Goes through all reactions and computes the positive part of the CME (probability flowing into states). This requires accessing du and u at different locations depending on the net stoichiometries. In order to reduce  random memory access reactions are processed one by one.\n\nSee also: build_rhs\n\n\n\n\n\n","category":"function"}]
}

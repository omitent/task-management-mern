// const {projects, client, clients} = require ('../sampleData.js');

const { GraphQLObjectType,GraphQLID,GraphQLString,GraphQLSchema, GraphQLList, GraphQLNonNull, GraphQLEnumType } = require('graphql');

//mongoose models
const Project = require('../models/Project.js');
const Client = require('../models/Client.js');

//client type
const ClientType = new GraphQLObjectType({
    name: 'Client',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        email: {type: GraphQLString},
        phone: {type: GraphQLString},
    }),
});

//project type
const ProjectType = new GraphQLObjectType({
    name: 'Project',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        description: {type: GraphQLString},
        status: {type: GraphQLString},
        client:{
            type: ClientType,
            resolve(parent,args){
                // return clients.find((client) => client.id === parent.clientId)
                return Client.findById(parent.clientId);
            }
        }
    }),
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: () => ({
        projects:{
            type: GraphQLList(ProjectType),
            resolve(){
                // return projects
                return Project.find();
            }
        },
        project: {
            type: ProjectType,
            args: {id : {type : GraphQLID}},
            resolve(parent,args){
                // return projects.find((project) => project.id === args.id)
                return Project.findById(args.id);
            }
        },
        clients:{
            type: GraphQLList(ClientType),
            resolve(){
                // return clients
                return Client.find();
            }
        },
        client: {
            type: ClientType,
            args: {id : {type : GraphQLID}},
            resolve(parent,args){
                // return clients.find((client) => client.id === args.id)
                return Client.findById(args.id);
            }
        }
    }),
});


//mutations
 const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields:{
        // add a client
        addClient:{
            type:ClientType,
            args:{
                name: {type: GraphQLNonNull(GraphQLString)},
                email: {type: GraphQLNonNull(GraphQLString)},
                phone: {type: GraphQLNonNull(GraphQLString)},
            },
            resolve(parent,args){
                const client = new Client({
                    name: args.name,
                    email: args.email,
                    phone: args.phone,
                });
                return client.save();
            }
        },
        //delete a client
        deleteClient:{
            type:ClientType,
            args:{
                id: {type : GraphQLNonNull(GraphQLID)},
            },
            resolve(parent,args){
                return Client.findByIdAndRemove(args.id);
            }
        },
        //add a project
        addProject:{
            type:ProjectType,
            args:{
                name: {type: GraphQLNonNull(GraphQLString)},
                description: {type: GraphQLNonNull(GraphQLString)},
                status:{
                    type:new GraphQLEnumType({
                        name: 'ProjectStatus',
                        values:{
                            'new' : {value: "Not Started"}, 
                            'progress' : {value: "In Progress"}, 
                            'completed' : {value: "Completed"}, 
                        }
                    }),
                    defaultValue: 'Not Started',
                },
                clientId: {type: GraphQLNonNull(GraphQLID)},
            },
            resolve(parent,args){
                const project = new Project({
                    name: args.name,
                    description: args.description,
                    clientId: args.clientId,
                    status: args.status,
                });
                return project.save();
            }
        },
        //delete a project
        deleteProject:{
            type:ProjectType,
            args:{
                id: {type : GraphQLNonNull(GraphQLID)},
            },
            resolve(parent,args){
                return Project.findByIdAndRemove(args.id);
            }
        },
        //update a project
        updateProject:{
            type:ProjectType,
            args:{
                id: {type: GraphQLNonNull(GraphQLID)},
                name: {type: GraphQLNonNull(GraphQLString)},
                description: {type: GraphQLNonNull(GraphQLString)},
                status:{
                    type:new GraphQLEnumType({
                        name: 'ProjectStatusUpdate',
                        values:{
                            'new' : {value: "Not Started"}, 
                            'progress' : {value: "In Progress"}, 
                            'completed' : {value: "Completed"}, 
                        }
                    }),
                },
            },
            resolve(parent,args){
                return Project.findByIdAndUpdate(
                    args.id,
                    {
                        $set:{
                            name: args.name,
                            description: args.description,
                            status: args.status,
                        },
                    },
                    {new: true}
                );
            }
        },
    }
    
 });

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
})
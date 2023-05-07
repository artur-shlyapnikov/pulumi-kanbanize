import * as pulumi from '@pulumi/pulumi';
import { InlineObject5 as BoardData, Configuration, InlineObject6 as NewBoardData, ObjectBoardsApi } from './kanbanize-client/';
import { InlineResponse20015 as ArchivedBoardResponse, BoardsApiDeleteBoardRequest, BoardsApiUpdateBoardRequest } from './kanbanize-client/api';

const config = new pulumi.Config();
const apiKey = config.requireSecret('kanbanizeApiKey');
const baseServer = config.require('kanbanizeBaseServer');

type Inputs = {
    apiKey: string;
    boardData: BoardData;
    id?: string;
};

const createServerConfiguration = async (apiKey: string): Promise<Configuration> => {
    const { createConfiguration, ServerConfiguration } = await import('./kanbanize-client');
    return createConfiguration({
        baseServer: new ServerConfiguration(baseServer, {}),
        authMethods: { apikey: apiKey },
        promiseMiddleware: [
            {
                pre: async (req) => {
                    console.log(req.getHeaders());
                    return req;
                },
                post: async (resp) => resp,
            },
        ],
    });
};

const createBoardsApiInstance = async (configuration: Configuration): Promise<ObjectBoardsApi> => {
    const { ObjectBoardsApi } = await import('./kanbanize-client/api');
    return new ObjectBoardsApi(configuration);
};

const withApi = (action: (boardsApi: ObjectBoardsApi, inputs: Inputs) => Promise<any>) => async (inputs: Inputs) => {
    const configuration = await createServerConfiguration(inputs.apiKey);
    const boardsApi = await createBoardsApiInstance(configuration);
    return action(boardsApi, inputs);
};

const createBoardAction = async (boardsApi: ObjectBoardsApi, inputs: Inputs) => {
    const response = await boardsApi.createBoard({ InlineObject5: inputs.boardData });
    return { id: response.data.board_id.toString(), outs: { ...inputs.boardData, apiKey: inputs.apiKey } };
};

const updateBoardAction = async (boardsApi: ObjectBoardsApi, inputs: Inputs) => {
    const updateRequest: BoardsApiUpdateBoardRequest = {
        board_id: parseInt(inputs.id!),
        InlineObject6: inputs.boardData as NewBoardData,
    };
    console.log("Updating the board: ", updateRequest);
    const response = await boardsApi.updateBoard(updateRequest);
    return { outs: { ...response.data, apiKey: inputs.apiKey } };
};

const archiveBoardAction = async (boardsApi: ObjectBoardsApi, inputs: Inputs) => {
    console.log("Archiving the board: ", inputs.id!)
    const response: ArchivedBoardResponse = await boardsApi.updateBoard({ board_id: parseInt(inputs.id!), InlineObject6: { is_archived: 1 } });
    if (response.data?.is_archived !== 1) {
        throw new Error(`Board ${response.data?.name} was not archived.`);
    } else {
        console.log(`Board ${response.data?.name} was archived.`);
    }
    return { outs: { ...response.data, apiKey: inputs.apiKey } };
};


const deleteBoardAction = async (boardsApi: ObjectBoardsApi, inputs: Inputs) => {
    console.log("Deleting the board: ", inputs.id!)
    await archiveBoardAction(boardsApi, inputs);
    const deleteRequest: BoardsApiDeleteBoardRequest = { board_id: parseInt(inputs.id!) };
    await boardsApi.deleteBoard(deleteRequest);
};
const createBoard = withApi(createBoardAction);
const updateBoard = withApi(updateBoardAction);
const deleteBoard = withApi(deleteBoardAction);
const archiveBoard = withApi(archiveBoardAction);

class KanbanizeBoard extends pulumi.dynamic.Resource {
    constructor(name: string, boardData: BoardData, apiKey: pulumi.Output<string>, opts?: pulumi.CustomResourceOptions) {
        const provider: pulumi.dynamic.ResourceProvider = {
            // it works
            async create(inputs: Inputs) {
                console.log("create");

                const { id, outs } = await createBoard(inputs);
                return { id, outs };
            },
            // and it works!
            async update(id: string, _olds: Inputs, news: Inputs) {
                console.log("update");

                return updateBoard({ ...news, id });
            },
            // but it doesn't, because we don't have the API key in the request
            async delete(id: string, props: Inputs) {
                debugger;
                console.log("delete", props);
                await archiveBoard({ ...props, id });
                return deleteBoard({ ...props, id });
            },
        };

        const props = { apiKey: apiKey.apply(apiKey => apiKey ? apiKey.toString() : undefined), boardData: boardData };

        super(provider, name, props, opts);
    }
}


(async () => {
    // To make sure that the update methods work, you can uncomment the lines below

    // const newBoard = new KanbanizeBoard('VeryNewBoard', {
    //    name: 'new name',
    //    workspace_id: 2
    // }, apiKey);

    const anotherBoard = new KanbanizeBoard('BoardInDemoWorkspace', {
        name: 'T',
        workspace_id: 1
    }, apiKey);

})();

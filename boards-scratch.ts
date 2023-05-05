import { InlineObject5 as BoardData, ServerConfiguration, createConfiguration } from './kanbanize-client';
import { ObjectBoardsApi } from './kanbanize-client/api';


const configuration = createConfiguration({
    baseServer: new ServerConfiguration('https://acmeinc.kanbanize.com/api/v2', {}),
    authMethods: { apikey: process.env.KANBANIZE_API_KEY }
});

const boardsApi = new ObjectBoardsApi(configuration);

async function fetchBoards() {
    try {
        const response = await boardsApi.getBoards({});
        console.log(response);
    } catch (error: any) {
        console.error('Error fetching boards:', error.message);
    }
}

async function createNewBoard(name: string, description: string, workspaceId: number) {
    try {
        const newBoardData = new BoardData({
            name: name,
            description: description,
            workspace_id: workspaceId
        });

        const response = await boardsApi.createBoard({ InlineObject5: newBoardData });
        console.log('New board created:', response);
    } catch (error: any) {
        console.error('Error creating new board:', error.message);
    }
}

async function archiveBoard(boardId: number) {
    try {
        const response = await boardsApi.updateBoard({ board_id: boardId, InlineObject6: { is_archived: 1 } });
        console.log('Board archived:', response);
    } catch (error: any) {
        console.error('Error archiving board:', error.message);
    }
}

// the board must be archived before it can be deleted
async function deleteBoard(boardId: number) {
    try {
        const response = await boardsApi.deleteBoard({ board_id: boardId });
        console.log('Board deleted:', response);
    } catch (error: any) {
        console.error('Error deleting board:', error.message);
    }
}

async function main() {
    await fetchBoards();
    await createNewBoard('New Board', 'Some IaC', 2);
    await archiveBoard(5);
    await deleteBoard(5);
    await fetchBoards();
}

main();
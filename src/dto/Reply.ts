export default interface Reply {
    id: number;
    contents: string;
    create_date: string;
    post_id: number;
    writer: number;
    parent_id?: number;

    nickname?: string; // for display
}
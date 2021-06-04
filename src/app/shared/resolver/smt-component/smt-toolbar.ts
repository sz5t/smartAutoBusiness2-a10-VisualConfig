export interface ILayout {
    add(child: any);
    delete(child: any);
    edit(child: any);
}

export class SmtToolbar implements ILayout {
    private _id: string;
    private _title: string;
    private _component: string = 'cnToolbar';
    private _children: any[];
    private _originData: any;

    public get id(): string {
        return this._id;
    }
    public set id(value: string) {
        this._id = value;
    }

    public get title(): string {
        return this._title;
    }
    public set title(value: string) {
        this._title = value;
    }

    public get component(): string {
        return this._component;
    }
    public set component(value: string) {
        this._component = value;
    }
    public get originData(): any {
        return this._originData;
    }
    public set originData(value: any) {
        this._originData = value;
    }

    public get children(): any[] {
        return this._children;
    }
    public set children(value: any[]) {
        this._children = value;
    }

    public add(row: any) {
        throw new Error('Method not implemented.');
    }
    delete(row: any) {
        throw new Error('Method not implemented.');
    }
    edit(row: any) {
        throw new Error('Method not implemented.');
    }
}
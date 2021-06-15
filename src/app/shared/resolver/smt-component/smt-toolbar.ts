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
    private _parentId: any;
    private _customCommand: any[];
    private _eventConent: any[];

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

    public get parentId(): any {
        return this._parentId;
    }
    public set parentId(value: any) {
        this._parentId = value;
    }

    public get children(): any[] {
        return this._children;
    }
    public set children(value: any[]) {
        this._children = value;
    }

    public get eventConent(): any[] {
        return this._eventConent;
    }
    public set eventConent(value: any[]) {
        this._eventConent = value;
    }

    public get customCommand(): any[] {
        return this._customCommand;
    }
    public set customCommand(value: any[]) {
        this._customCommand = value;
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
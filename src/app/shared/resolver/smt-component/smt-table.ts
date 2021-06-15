export interface ILayout {
    add(child: any);
    delete(child: any);
    edit(child: any);
}

export class SmtDataTable implements ILayout {
    private _id: string;
    private _title: string;
    private _titleIcon: string;
    private _component: string = 'cnDataTable';
    private _keyId: string;
    private _size: string;
    private _pageSize: number;
    private _isBordered: boolean;
    private _isFrontPagination: boolean;
    private _isPagination: boolean;
    private _isShowSizeChanger: boolean;
    private _showTotal: boolean;
    private _showCheckBox: boolean;
    private _enableColSummary: boolean;
    private _loadingOnInit: boolean;
    private _isSelected: boolean;
    private _pageSizeOptions: any[];
    private _scroll: any;
    private _columns: any[];
    private _children: any[];
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

    public get titleIcon(): string {
        return this._titleIcon;
    }
    public set titleIcon(value: string) {
        this._titleIcon = value;
    }

    public get component(): string {
        return this._component;
    }
    public set component(value: string) {
        this._component = value;
    }

    public get keyId(): string {
        return this._keyId;
    }
    public set keyId(value: string) {
        this._keyId = value;
    }

    public get size(): string {
        return this._size;
    }
    public set size(value: string) {
        this._size = value;
    }

    public get pageSize(): number {
        return this._pageSize;
    }
    public set pageSize(value: number) {
        this._pageSize = value;
    }

    public get isBordered(): boolean {
        return this._isBordered;
    }
    public set isBordered(value: boolean) {
        this._isBordered = value;
    }

    public get isFrontPagination(): boolean {
        return this._isFrontPagination;
    }
    public set isFrontPagination(value: boolean) {
        this._isFrontPagination = value;
    }

    public get isPagination(): boolean {
        return this._isPagination;
    }
    public set isPagination(value: boolean) {
        this._isPagination = value;
    }

    public get isShowSizeChanger(): boolean {
        return this._isShowSizeChanger;
    }
    public set isShowSizeChanger(value: boolean) {
        this._isShowSizeChanger = value;
    }

    public get showTotal(): boolean {
        return this._showTotal;
    }
    public set showTotal(value: boolean) {
        this._showTotal = value;
    }

    public get showCheckBox(): boolean {
        return this._showCheckBox;
    }
    public set showCheckBox(value: boolean) {
        this._showCheckBox = value;
    }

    public get enableColSummary(): boolean {
        return this._enableColSummary;
    }
    public set enableColSummary(value: boolean) {
        this._enableColSummary = value;
    }

    public get loadingOnInit(): boolean {
        return this._loadingOnInit;
    }
    public set loadingOnInit(value: boolean) {
        this._loadingOnInit = value;
    }

    public get isSelected(): boolean {
        return this._isSelected;
    }
    public set isSelected(value: boolean) {
        this._isSelected = value;
    }

    public get pageSizeOptions(): any[] {
        return this._pageSizeOptions;
    }
    public set pageSizeOptions(value: any[]) {
        this._pageSizeOptions = value;
    }

    public get scroll(): any {
        return this._scroll;
    }
    public set scroll(value: any) {
        this._scroll = value;
    }

    public get columns(): any[] {
        return this._columns;
    }
    public set columns(value: any[]) {
        this._columns = value;
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
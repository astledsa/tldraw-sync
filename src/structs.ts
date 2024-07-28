export type DiffChange = Map< { user: string; timestamp: string; }, {
  action: 'add',
  NewValue: Map<string, number | string>
} | {
  action: 'delete', 
  OldValue: Map<string, number | string>
} | {
  action: 'update', 
  OldValue: Map<string, number | string>, 
  Newvalue: Map<string, number | string>
}>
      
export interface TLShape {
  parentId: string; id: string;
  typeName: string; type: string;
  rotation: number; index: string;
  opacity: number; isLocked: boolean;
  x: number; y: number;
  props: {
    w: number; h: number;
    geo: string; color: string;
    labelColor: string; fill: string;
    dash: string; size: string;
    font: string; text: string;
    align: string; verticalAlign: string;
    growY: number; url: string;
  };
  meta: {
    boardID: string;
  }; 
}
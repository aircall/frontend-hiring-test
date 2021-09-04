import { CallNoteModel } from './call-note.model';
import { CallModel } from './call.model';

export class CallDetailsModel extends CallModel {
  public duration: number = 0;
  public via: string = '';
  public notes: CallNoteModel[] = [];

  constructor() {
    super();
  }
}

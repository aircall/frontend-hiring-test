import { CALL_DIRECTION } from './call-direction.enum';
import { CALL_TYPE } from './call-type.enum';

export class CallModel {
  public id: string = '';
  public direction: CALL_DIRECTION = CALL_DIRECTION.inbound;
  public from: string = '';
  public to: string = '';
  public is_archived: boolean = false;
  public call_type: CALL_TYPE = CALL_TYPE.answered;
  public created_at: string = '';
  constructor() {}
}

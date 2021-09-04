import { CALL_DIRECTION } from './call-direction.enum';
import { CALL_TYPE } from './call-type.enum';

export class CallModel {
  constructor(
    public id: string,
    public direction: CALL_DIRECTION,
    public from: string,
    public to: string,
    public is_archived: boolean,
    public call_type: CALL_TYPE,
    public created_at: string
  ) {}
}

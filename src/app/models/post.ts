import {Structure} from './structure';
import {Company} from './company';
import {Regular} from './regular';
import {Applicant} from './applicant';
import {Skill} from './skill';
import {JsonDocument} from "./json-document";
import {Offeror} from "./offeror";

export interface Post {
  id: number;
  hide: boolean;
  pubblicationDate: Date;
  name: string;
  structure: Structure;
  jsonDocument: JsonDocument[];
  candidateUserList: Applicant[];
  skillList: Skill[];
  createdBy: Applicant | Offeror;
  commentList: Comment[];
}

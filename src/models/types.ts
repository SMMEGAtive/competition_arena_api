//
// LOGIN
//
const LoginSchema = {
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 8,
    },
  },
};

export const LoginRequestBody = {
  description: 'Request Body fungi Login',
  required: true,
  content: {'application/json': {schema: LoginSchema}},
};

//
// CHANGE PASSWORD
//
export type ChangePassword = {
  old_password: 'string';
  new_password: 'string';
  new_password_reinput: 'string';
};

const ChangePasswordSchema = {
  properties: {
    old_password: {type: 'string', minLength: 8},
    new_password: {type: 'string', minLength: 8},
    new_password_reinput: {type: 'string', minLength: 8},
  },
};

export const ChangePasswordRequestBody = {
  description: 'Request Body fungsi Ubah Password',
  required: true,
  content: {'application/json': {schema: ChangePasswordSchema}},
};

//
// FORGOT PASSWORD
//
export type ForgotPassword = {
  new_password: 'string';
  new_password_reinput: 'string';
};

const ForgotPasswordSchema = {
  properties: {
    new_password: {type: 'string', minLength: 8},
    new_password_reinput: {type: 'string', minLength: 8},
  },
};

export const ForgotPasswordRequestBody = {
  description: 'Request Body fungsi Lupa Password',
  required: true,
  content: {'application/json': {schema: ForgotPasswordSchema}},
};

//
// REGISTER
//
export type Register = {
  Username: string;
  Email: string;
  Email_Verified: boolean;
  Phone: string;
  Password: string;
  Password_Verification: string;
  Role: number;
  Gender: number;
  Date_of_Birth: string;
};

const RegisterSchema = {
  properties: {
    Username: {type: 'string'},
    Email: {type: 'string'},
    Email_Verified: {type: 'boolean'},
    Phone: {type: 'string'},
    Password: {type: 'string'},
    Password_Verification: {type: 'string'},
    Role: {type: 'number'},
    Gender: {type: 'number'},
    Date_of_Birth: {type: 'string'},
  },
};

export const RegisterRequestBody = {
  description: 'Request Body fungsi Register',
  required: true,
  content: {'application/json': {schema: RegisterSchema}},
};

//
// CREATE HOST
//
export type CreateHostTeam = {
  Host_Name: string;
  Members: number[];
};

const CreateHostTeamSchema = {
  properties: {
    Host_Name: {type: 'string'},
    Members: {type: 'array', items: {type: 'number'}},
  },
};

export const CreateHostTeamRequestBody = {
  description: 'Request Body fungsi Create Host Team',
  required: true,
  content: {'application/json': {schema: CreateHostTeamSchema}},
};

//
// UPDATE HOST
//
export type HostTeam = {
  Host_Name: string;
  Members: number[];
};

const HostTeamSchema = {
  properties: {
    Host_Name: {type: 'string'},
    Members: {type: 'array', items: {type: 'number'}},
  },
};

export const HostTeamRequestBody = {
  description: 'Request Body fungsi Host Team',
  required: true,
  content: {'application/json': {schema: HostTeamSchema}},
};

//
// CREATE PARTICIPANT
//
export type ParticipantTeam = {
  Team_Name: string;
  Members: number[];
};

const ParticipantTeamSchema = {
  properties: {
    Team_Name: {type: 'string'},
    Members: {type: 'array', items: {type: 'number'}},
  },
};

export const ParticipantTeamRequestBody = {
  description: 'Request Body fungsi Participant Team',
  required: true,
  content: {'application/json': {schema: ParticipantTeamSchema}},
};

//
// CREATE COMPETITION
//
export type CompetitionData = {
  ID_Host: number;
  Title: string;
  Description: string;
  Registration_Start: string;
  Registration_End: string;
  Verification_End: string;
  Execution_Start: string;
  Execution_End: string;
  Announcement_Date: string;
  Tags: string[];
};

const CompetitionSchema = {
  properties: {
    ID_Host: {type: 'number'},
    Title: {type: 'string'},
    Description: {type: 'string'},
    Registration_Start: {type: 'string'},
    Registration_End: {type: 'string'},
    Verification_End: {type: 'string'},
    Execution_Start: {type: 'string'},
    Execution_End: {type: 'string'},
    Announcement_Date: {type: 'string'},
    Tags: {type: 'array', items: {type: 'string'}},
  },
};

export const CompetitionRequestBody = {
  description: 'Request Body fungsi Participant Team',
  required: true,
  content: {'application/json': {schema: CompetitionSchema}},
};

//
// PARTICIPATION
//
export type ParticipationData = {
  ID_Participant: number;
  ID_Competition: number;
};

const ParticipationSchema = {
  properties: {
    ID_Participant: {type: 'number'},
    ID_Competition: {type: 'number'},
  },
};

export const ParticipationRequestBody = {
  description: 'Request Body fungsi Participant Team',
  required: true,
  content: {'application/json': {schema: ParticipationSchema}},
};

//
// CHAT ROOM
//
export type ChatRoomData = {
  Room_Name: string;
  Members: number[];
};

const ChatRoomSchema = {
  properties: {
    Room_Name: {type: 'string'},
    Members: {type: 'array', items: {type: 'number'}},
  },
};

export const ChatRoomRequestBody = {
  description: 'Request Body fungsi Participant Team',
  required: true,
  content: {'application/json': {schema: ChatRoomSchema}},
};

//
// SUBMISSION
//
export type SubmissionData = {
  ID_Competition: number;
  Link: string;
  Title: string;
  Description: string;
};

const SubmissionSchema = {
  properties: {
    ID_Competition: {type: 'number'},
    Link: {type: 'string'},
    Title: {type: 'string'},
    Description: {type: 'string'},
  },
};

export const SubmissionRequestBody = {
  description: 'Request Body fungsi Participant Team',
  required: true,
  content: {'application/json': {schema: SubmissionSchema}},
};

//
// SUBMISSION
//
export type CommentData = {
  ID_Submission: number;
  Content: string;
};

const CommentSchema = {
  properties: {
    ID_Submission: {type: 'number'},
    Content: {type: 'string'},
  },
};

export const CommentRequestBody = {
  description: 'Request Body fungsi Participant Team',
  required: true,
  content: {'application/json': {schema: CommentSchema}},
};

//
// SUBMISSION
//
export type ScoreData = {
  ID_Submission: number;
  Score: number;
  Impression: string;
};

const ScoreSchema = {
  properties: {
    ID_Submission: {type: 'number'},
    Score: {type: 'number'},
    Impression: {type: 'string'},
  },
};

export const ScoreRequestBody = {
  description: 'Request Body fungsi Participant Team',
  required: true,
  content: {'application/json': {schema: ScoreSchema}},
};

//
// MISCTYPES
//
export type UserLimited = {ID_User: number; Username: string};
export type HostLimited = {
  ID_Host: number;
  Host_Name: string;
};
export type ParticipantLimited = {
  ID_Participant: number;
  Team_Name: string;
};

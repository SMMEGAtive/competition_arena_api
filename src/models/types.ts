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

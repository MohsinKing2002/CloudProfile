/************** Logo Props **************/
export type LogoProps = {
  className?: string;
  user?: any;
};

/************** Sign Up **************/
export type SignUpProps = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  avatar?: string;
};

/************** Sign In **************/
export type LoginProps = {
  loginIdentifier: string;
  password: string;
};

/************** Sign Up **************/
export type UserProps = {
  _id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  createdAt: string;
};

/************** Edit Profile **************/
export type EditProfileProps = {
  name: string;
  bio: string;
};

/************** Feedback **************/
export type FeedbackProps = {
  name: string;
  email: string;
  feedback_text: string;
  rating: number;
};
/************** Separator Props **************/
export type SeparatorProps = {
  className?: string;
};

/************** Form Component Props **************/
export type FormInputProps = {
  id: string;
  type: string;
  placeholder: string;
  label: string;
  isTextarea?: boolean;
  value: string;
  onChange: (e?: any) => void;
};

export type FormButtonProps = {
  label: string;
  loading?: boolean;
  disabled?: boolean;
  onClick: (e?: any) => void;
};

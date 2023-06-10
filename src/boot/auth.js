import auth from "../store/auth";

export default async () => {
  await auth.checkAuth();
};

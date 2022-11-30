import { AuthenticationError } from 'apollo-server-express';


export const useAuthValidator = (context: any) => {
    const { currentUser } = context.req
    if (!currentUser) {
        throw new AuthenticationError('Authentication is required');
    }
    if (currentUser.role === "User") {
        throw new AuthenticationError('Admin or SuperAdmin can access only');
    }
}



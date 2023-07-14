import bcrypt from 'bcrypt';
import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider  from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook'
import { PrismaAdapter } from '@next-auth/prisma-adapter';

import prisma from '@/app/libs/prismadb';


// we will be using authOption for creating server session
export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID as string,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
        }),
        
        // for our basic auth like with register email and password
        CredentialsProvider({
            // this name "credentials" we given is used in AuthForm.tsx
            name: 'credentials',
            credentials: {
                email: { label: 'email', type: 'text' },
                password: { label: 'password', type: 'password' },
            },
            // comparing entered email and password with the database
            async authorize(credentials) {
                // if no credentials passed
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Invalid Credentials');
                };

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                });

                // !user?.hashedPassword is for if user is registered using google or github
                if (!user || !user?.hashedPassword) {
                    throw new Error('Invalid user');
                };

                // checking correct password. imp: donot forget await
                const isCorrectPassword = await bcrypt.compare(
                    credentials.password,
                    user.hashedPassword,
                );

                if (!isCorrectPassword) {
                    throw new Error('Invalid Password');
                };

                // return if user and password match
                return user;
            }
        })
    ],
    // debug is useful if on development phase of app
    debug: process.env.NODE_ENV === 'development',
    session: {
        strategy: 'jwt'
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

// in previous or in our sushinefly app we didnt did this handler action but we are going to need it for our app folder routes here
export { handler as GET, handler as POST };
import { configDotenv } from 'dotenv';
import http from 'http';
import Express from 'express';
import {Server, Socket } from 'socket.io';
import { clerkMiddleware } from '@clerk/express';


configDotenv();
const port = process.env.PORT || 5000;

const app = Express();

app.use(clerkMiddleware);







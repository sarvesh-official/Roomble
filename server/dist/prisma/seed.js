"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // Predefined category tags
        const predefinedTags = [
            { name: 'Tech', isCategory: true },
            { name: 'Business', isCategory: true },
            { name: 'Education', isCategory: true },
            { name: 'Social', isCategory: true },
            { name: 'Entertainment', isCategory: true },
            { name: 'Events', isCategory: true },
            { name: 'Finance', isCategory: true },
            { name: 'Health', isCategory: true }
        ];
        console.log('Seeding predefined tags...');
        // Create tags if they don't exist
        for (const tag of predefinedTags) {
            const existingTag = yield prisma.tag.findUnique({
                where: { name: tag.name }
            });
            if (!existingTag) {
                yield prisma.tag.create({
                    data: tag
                });
                console.log(`Created tag: ${tag.name}`);
            }
            else {
                console.log(`Tag already exists: ${tag.name}`);
            }
        }
        console.log('Seeding completed');
    });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));

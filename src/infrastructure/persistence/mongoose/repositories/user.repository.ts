import { UserRepository } from '../../../../domain/ports/repositories/user.repository';
import { User } from '../../../../domain/entities/user.entity';
import { UserModel, IUserDocument } from '../schemas/user.schema';

export class MongoUserRepository implements UserRepository {
    private documentToEntity(doc: IUserDocument): User {
        return User.create({
            id: doc._id.toString(),
            fullName: doc.fullName,
            email: doc.email,
            password: doc.password,
            phone: doc.phone
        });
    }

    async save(user: User): Promise<User> {
        const userData = {
            fullName: user.fullName,
            email: user.email,
            password: user.password,
            phone: user.phone
        };

        if (user.id) {
            const updated = await UserModel.findByIdAndUpdate(
                user.id,
                userData,
                { new: true }
            );
            return this.documentToEntity(updated!);
        } else {
            const created = await UserModel.create(userData);
            return this.documentToEntity(created);
        }
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await UserModel.findOne({ email });
        return user ? this.documentToEntity(user) : null;
    }

    async findById(id: string): Promise<User | null> {
        const user = await UserModel.findById(id);
        return user ? this.documentToEntity(user) : null;
    }

    async findAll(): Promise<User[]> {
        const users = await UserModel.find();
        return users.map(user => this.documentToEntity(user));
    }
}

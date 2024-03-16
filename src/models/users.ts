import {
  DataTypes, 
  Model, 
  InferAttributes, 
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import sequelize from '../database/connection';

// order of InferAttributes & InferCreationAttributes is important.
class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<string>;
  declare username: string;
  declare email: string;
  declare password: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    username: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true, 
      }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            min: 8,  
        }
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    
  },
  {
    tableName: 'users',
    sequelize// passing the `sequelize` instance is required
  }
);

export default User;
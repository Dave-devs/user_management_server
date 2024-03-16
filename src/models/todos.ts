import {
  DataTypes, 
  Model, 
  InferAttributes, 
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import sequelize from '../database/connection';

// order of InferAttributes & InferCreationAttributes is important.
class Todo extends Model<InferAttributes<Todo>, InferCreationAttributes<Todo>> {
  declare id: CreationOptional<string>;
  declare title: string;
  declare description: string;
  declare status: CreationOptional<string>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Todo.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('in-progress', 'done'),
        allowNull: false,
        defaultValue: 'in-progress',
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    
  },
  {
    tableName: 'todos',
    sequelize// passing the `sequelize` instance is required
  }
);

export default Todo;
module.exports = (sequelize, DataTypes) => {
  const Participant = sequelize.define(
    "Participant",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      matchId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      position: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      isConfirmed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "Participants",
      timestamps: true,
      updatedAt: false,
    }
  );

  Participant.associate = (models) => {
    Participant.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
    Participant.belongsTo(models.Match, {
      foreignKey: "matchId",
      onDelete: "CASCADE",
    });
  };

  return Participant;
};

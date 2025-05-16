module.exports = (sequelize, DataTypes) => {
  const TeamPlayer = sequelize.define(
    "TeamPlayer",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      teamId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "TeamPlayers",
      timestamps: false,
    }
  );

  TeamPlayer.associate = (models) => {
    TeamPlayer.belongsTo(models.Team, {
      foreignKey: "teamId",
      onDelete: "CASCADE",
    });
    TeamPlayer.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
  };

  return TeamPlayer;
};

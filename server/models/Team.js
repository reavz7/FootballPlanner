module.exports = (sequelize, DataTypes) => {
  const Team = sequelize.define(
    "Team",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      matchId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    },
    {
      tableName: "Teams",
      timestamps: false,
    }
  );

  Team.associate = (models) => {
    Team.belongsTo(models.Match, {
      foreignKey: "matchId",
      onDelete: "CASCADE",
    });
    Team.hasMany(models.TeamPlayer, {
      foreignKey: "teamId",
      onDelete: "CASCADE",
    });
  };

  return Team;
};

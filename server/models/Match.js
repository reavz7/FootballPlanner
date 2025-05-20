module.exports = (sequelize, DataTypes) => {
  const Match = sequelize.define(
    "Match",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "Matches",
      timestamps: true,
    }
  );

  Match.associate = (models) => {
    Match.belongsTo(models.User, {
      foreignKey: "createdBy",
      onDelete: "CASCADE",
    });
    Match.hasMany(models.Participant, {
      foreignKey: "matchId",
      onDelete: "CASCADE",
    });
  };

  return Match;
};

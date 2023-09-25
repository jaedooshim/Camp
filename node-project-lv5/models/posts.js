"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Posts extends Model {
    static associate(models) {
      //user와 1:N관계
      this.belongsTo(models.Users, {
        // Users 모델에게 N:1 관계설정
        targetKey: "userId", // Users 모델의 userId 컬럼을
        foreignKey: "UserId", // Posts 모델의 UserId 컬럼과 연결
      });

      this.hasMany(models.Likes, {
        // Posts모델에게 1:N 관계설정
        sourceKey: "postId", // Users 모델의 postId 컬럼을
        foreignKey: "PostId", // Posts 모델의 PostId 컬럼과 연결
      });
    }
  }

  Posts.init(
    {
      postId: {
        allowNull: false, // NOT NULL
        autoIncrement: true, // AUTO_INCREMENT
        primaryKey: true, // Primary Key (기본키)
        type: DataTypes.INTEGER,
      },
      UserId: {
        allowNull: false, // NOT NULL
        type: DataTypes.INTEGER,
      },
      title: {
        allowNull: false, // NOT NULL
        type: DataTypes.STRING,
      },
      nickname: {
        allowNull: false, // NOT NULL
        type: DataTypes.STRING,
      },
      content: {
        allowNull: false, // NOT NULL
        type: DataTypes.STRING,
      },
      likeCount: {
        allowNull: true, // NOT NULL
        type: DataTypes.INTEGER,
      },
      createdAt: {
        allowNull: false, // NOT NULL
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        allowNull: false, // NOT NULL
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Posts",
    }
  );
  return Posts;
};

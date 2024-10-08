const postQueries = {
  getPostsList: (whereCondition: string, sortKey: string) => {
    return `SELECT 
                p.id,
                p.grpId,
                p.nickname,
                p.title,
                p.content,
                p.imageUrl,
                p.location,
                p.moment,
                p.isPublic,
                p.likeCount,
                (SELECT COUNT(*) FROM Comments c WHERE p.id = c.postId) AS commentCount,
                p.createdAt,
                p.password,
                p.tags
            FROM 
                Posts p
              WHERE ${whereCondition}
              ORDER BY ${sortKey}
              LIMIT ?, ?`;
  },
  getPostDetail: () => {
    return `SELECT * FROM Posts WHERE id=?`;
  },
  getCount: (groupId: string, isPublic: boolean, keyword?: string) => {
    const whereCondition = postQueries.getWhereCondition(
      groupId,
      isPublic,
      keyword
    );
    return `SELECT Count(*) AS totalItemCount FROM Posts WHERE ${whereCondition}`;
  },
  getWhereCondition: (groupId: string, isPublic: boolean, keyword?: string) => {
    let whereCondition = `grpId=${groupId} AND isPublic=${isPublic}`;
    if (keyword != "") {
      whereCondition += ` AND (title LIKE '%${keyword}%' OR JSON_CONTAINS(tags,'"${keyword}"'))`;
    }
    return whereCondition;
  },

  postPost: () => {
    return `INSERT INTO Posts
                  (grpId, nickname, title, content, imageUrl, location, moment, isPublic, password, tags)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, JSON_ARRAY(?))`;
  },
  postPut: () => {
    return `UPDATE Posts SET
                  nickname=?,
                  title=?,
                  content=?,
                  imageUrl=?,
                  location=?,
                  moment=?,
                  isPublic=?,
                  tags=JSON_ARRAY(?)
                WHERE id=?`;
  },
  postDelete: () => {
    return `DELETE FROM Posts WHERE id=?`;
  },
  postVerifyPassword: () => {
    return `SELECT password FROM Posts WHERE id=?`;
  },
  postLike: () => {
    return `UPDATE Posts set likeCount=likeCount+1 WHERE id=?`;
  },
  postGetId: () => {
    return `SELECT grpid FROM Posts WHERE id=?`;
  },
  postLikeRollback: () => {
    return `UPDATE Posts set likeCount=likeCount-1 WHERE id=?`;
  },
  postIsPublic: () => {
    return `SELECT id, isPublic FROM Posts WHERE id=?`;
  },
};

export default postQueries;

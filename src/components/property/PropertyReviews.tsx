import type { ReelComment } from "@/lib/types";
import styles from "./PropertyReviews.module.css";

// The reel's comment thread, surfaced inside the property modal as social
// proof - the same voices that react to the reel read here almost like
// reviews. Shares the reel comment data model (author + text + likes) and
// carries the reel's total like count as a headline stat.
export function PropertyReviews({ comments, likes }: { comments: ReelComment[]; likes: number }) {
  return (
    <div className={styles.reviews}>
      <div className={styles.header}>
        <span className={styles.title}>From the reel</span>
        <div className={styles.stats}>
          <span className={styles.stat}>♥ {likes.toLocaleString()}</span>
          <span className={styles.stat}>{comments.length} comments</span>
        </div>
      </div>
      {/* The list is absolutely filled inside this flex-sized wrapper so its
          content height never counts toward the modal's intrinsic height - the
          taller left column defines the modal height, and long comment threads
          scroll inside this box rather than scrolling the whole modal. */}
      <div className={styles.listWrap}>
        <div className={styles.list}>
          {comments.map((comment) => (
            <div key={`${comment.author}-${comment.text}`} className={styles.comment}>
              <div className={styles.avatar}>{comment.author.replace("@", "")[0]?.toUpperCase() ?? "?"}</div>
              <div className={styles.bubble}>
                <div className={styles.meta}>
                  <span className={styles.author}>{comment.author}</span>
                  <span className={styles.likes}>♥ {comment.likes}</span>
                </div>
                <p className={styles.text}>{comment.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

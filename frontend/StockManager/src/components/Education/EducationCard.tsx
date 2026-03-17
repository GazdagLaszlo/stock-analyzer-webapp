import type { ArticleDto } from '../../../generated-sources/openapi';
import { COLORS } from '../../constants/colors';
import useAuth from '../../hooks/useAuth';

type Props = {
  article: ArticleDto;
  deleteArticle: (article: ArticleDto) => void;
  updateArticle: (article: ArticleDto) => void;
};

const EducationCard = ({ article, deleteArticle, updateArticle }: Props) => {
  const { role } = useAuth();
  const isAdmin = role === 'Admin';

  return (
    <div className="box mb-2">
      <div className="level">
        <div className="level-left">
          <p className="has-text-weight-bold">{article.title}</p>
        </div>
        {isAdmin && (
          <div className="level-right">
            <span
              className="icon"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                updateArticle(article);
              }}
            >
              <i className="fa-regular fa-edit" />
            </span>
            <span
              className="icon"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                deleteArticle(article);
              }}
            >
              <i
                className="fa-regular fa-trash-can"
                style={{ color: COLORS.error }}
              ></i>
            </span>
          </div>
        )}
      </div>

      <p>{article.content}</p>
    </div>
  );
};

export default EducationCard;

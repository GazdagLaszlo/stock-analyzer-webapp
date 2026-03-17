import { useEffect, useState } from 'react';
import type {
  ArticleCreateUpdateDto,
  ArticleDto,
} from '../../../generated-sources/openapi';

type Props = {
  open: boolean;
  onClose: () => void;
  selectedItem?: ArticleDto | null;
  onEdit: (id: number | undefined, articleDto: ArticleCreateUpdateDto) => void;
  onCreate: (articleDto: ArticleCreateUpdateDto) => void;
  topics: string[];
};

const ArticleEditModal = ({
  open,
  onClose,
  selectedItem,
  onEdit,
  onCreate,
  topics,
}: Props) => {
  const [article, setArticle] = useState<ArticleCreateUpdateDto>({
    title: selectedItem?.title,
    content: selectedItem?.content,
    topic: selectedItem?.topic,
  });

  useEffect(() => {
    if (open) {
      if (selectedItem) {
        setArticle({
          title: selectedItem.title,
          content: selectedItem.content,
          topic: selectedItem.topic,
        });
      } else {
        setArticle({
          title: '',
          content: '',
          topic: topics[0],
        });
      }
    }
  }, [open, selectedItem]);

  console.log(article);

  return (
    <div className={`modal ${open ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-content">
        <div className="card p-6">
          <h1 className="title is-4 mb-6">
            {selectedItem ? 'Edit selected article' : 'Create article'}
          </h1>
          <div className="field">
            <label className="label">Topic</label>
            <div className="control select is-fullwidth">
              <select
                value={article.topic ?? ''}
                onChange={(e) =>
                  setArticle({
                    ...article,
                    topic: e.target.value == '' ? undefined : e.target.value,
                  })
                }
              >
                {topics.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="field">
            <label className="label">Title</label>
            <div className="control">
              <input
                className="input"
                value={article.title ?? ''}
                onChange={(e) =>
                  setArticle({
                    ...article,
                    title: e.target.value == '' ? undefined : e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Content</label>
            <div className="control">
              <textarea
                className="textarea"
                placeholder="Type content..."
                value={article.content ?? ''}
                onChange={(e) =>
                  setArticle({ ...article, content: e.target.value })
                }
                style={{ height: '100px', minHeight: '0px' }}
              ></textarea>
            </div>
          </div>

          <div className="is-flex is-justify-content-center mt-5">
            <button
              className="button button-navy"
              onClick={() => {
                if (selectedItem) {
                  onEdit(selectedItem?.id, article);
                } else {
                  onCreate(article);
                }
                onClose();
              }}
            >
              {selectedItem ? 'Edit Article' : 'Create Article'}
            </button>
          </div>
        </div>
      </div>
      <button
        className="modal-close is-large"
        aria-label="close"
        onClick={onClose}
      ></button>
    </div>
  );
};

export default ArticleEditModal;

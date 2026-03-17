import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import api from '../api/api';
import EducationCard from '../components/Education/EducationCard';
import type {
  ArticleCreateUpdateDto,
  ArticleDto,
} from '../../generated-sources/openapi';
import ArticleEditModal from '../components/Education/ArticleEditModal';
import EducationDeleteModal from '../components/Education/EducationDeleteModal';
import { COLORS } from '../constants/colors';
import useAuth from '../hooks/useAuth';

const Education = () => {
  const [searchInput, setSearchInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { topic } = useParams<{ topic?: string }>();
  const queryClient = useQueryClient();

  const { role } = useAuth();
  const isAdmin = role === 'Admin';

  const [selectedArticle, setSelectedArticle] = useState<ArticleDto | null>(
    null
  );
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const { data: articles = [] } = useQuery({
    queryKey: ['articles', topic, searchInput],
    queryFn: async () => {
      const topicToSearch = searchInput ? undefined : topic;
      const res = await api.Article.apiArticleGetAllGet(
        searchInput,
        topicToSearch
      );
      return res.data.sort(
        (article1, article2) => (article2.id ?? 0) - (article1.id ?? 0)
      );
    },
  });

  const deleteArticle = async () => {
    try {
      if (!selectedArticle?.id) return;
      await api.Article.apiArticleDeleteIdDelete(selectedArticle.id);
      queryClient.invalidateQueries({
        queryKey: ['articles', topic, searchInput],
      });
    } catch (error) {
      console.log(error);
    }
  };

  const updateArticle = async (
    id: number | undefined,
    articleDto: ArticleCreateUpdateDto
  ) => {
    try {
      if (!id) return;
      await api.Article.apiArticleUpdateIdPut(id, articleDto);
      queryClient.invalidateQueries({
        queryKey: ['articles', topic, searchInput],
      });
      setSelectedArticle(null);
    } catch (error) {
      console.log(error);
    }
  };

  const createArticle = async (articleDto: ArticleCreateUpdateDto) => {
    try {
      await api.Article.apiArticleCreatePost(articleDto);
      queryClient.invalidateQueries({
        queryKey: ['articles', topic, searchInput],
      });

      setSelectedArticle(null);
    } catch (error) {
      console.log(error);
    }
  };

  const menu = [
    {
      label: 'General',
      items: [{ name: 'Dashboard', url: 'dashboard' }],
    },
    {
      label: 'Fundamental Analysis',
      items: [
        { name: 'Valuation Ratios', url: 'valuation-ratios' },
        { name: 'Profitability Metrics', url: 'profitability-metrics' },
      ],
    },
    {
      label: 'Technical Analysis',
      items: [{ name: 'Indicators', url: 'indicators' }],
    },
    {
      label: 'Portfolio Management',
      items: [
        { name: 'Risk Management', url: 'portfolio-valuation-ratios' },
        {
          name: 'Profitability Metrics',
          url: 'portfolio-profitability-metrics',
        },
      ],
    },
    {
      label: 'Advanced Strategies',
      items: [
        { name: 'Value Investing', url: 'value-investing' },
        { name: 'Growth Investing', url: 'growth-investing' },
      ],
    },
  ];

  const topics = menu.flatMap((item) => item.items.map((item) => item.url));

  return (
    <div className="container mt-5">
      <div className="is-flex is-flex-direction-row" style={{ gap: 20 }}>
        <div style={{ width: '25vw' }}>
          <p
            className="is-size-5 mb-3 has-text-weight-bold"
            style={{ height: '5vh' }}
          >
            Education Center
          </p>
          <div className="box" style={{ width: '100%' }}>
            <aside className="menu">
              {menu.map((item) => (
                <div key={item.label}>
                  <p className="menu-label mt-3">{item.label}</p>
                  <ul className="menu-list">
                    {item.items.map((menuItem) => (
                      <li key={menuItem.url}>
                        <NavLink
                          to={`/app/education/${menuItem.url}`}
                          className={({ isActive }) =>
                            isActive ? 'is-active' : ''
                          }
                        >
                          {menuItem.name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </aside>
          </div>
        </div>
        <div style={{ width: '75vw' }}>
          <div className="is-flex is-flex-row">
            <div className="field mr-2 mb-3" style={{ flexGrow: '1' }}>
              <div className="control has-icons-left">
                <input
                  type="text"
                  className="input pl-6"
                  placeholder="Keresés..."
                  ref={inputRef}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <span className="icon is-left">
                  <i className="fas fa-search"></i>
                </span>
              </div>
            </div>
            {isAdmin && (
              <button
                className="button button-navy"
                style={{ height: '5vh' }}
                onClick={() => setEditModalOpen(true)}
              >
                <span
                  className="icon mr-1"
                  style={{ color: COLORS.background }}
                >
                  <i className="fa-solid fa-plus"></i>
                </span>
                New Article
              </button>
            )}
          </div>
          <div>
            {articles.length !== 0 ? (
              articles.map((article) => (
                <EducationCard
                  key={article.id}
                  article={article}
                  deleteArticle={(article) => {
                    setSelectedArticle(article);
                    setDeleteModalOpen(true);
                  }}
                  updateArticle={(article) => {
                    setSelectedArticle(article);
                    setEditModalOpen(true);
                  }}
                />
              ))
            ) : (
              <div className="has-text-centered py-6 mt-6">
                <span className="icon is-large has-text-grey-light mb-5 is-size-2">
                  <i className="fa-solid fa-book"></i>
                </span>
                <h3 className="title is-4 pb-2">No articles in this topic</h3>
                <p className="subtitle is-6 has-text-grey">
                  Check out other topics or come back later.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <EducationDeleteModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedArticle(null);
        }}
        selectedContentId={selectedArticle?.id}
        onDelete={deleteArticle}
      />
      <ArticleEditModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedArticle(null);
        }}
        selectedItem={selectedArticle}
        onEdit={updateArticle}
        onCreate={createArticle}
        topics={topics}
      />
    </div>
  );
};

export default Education;

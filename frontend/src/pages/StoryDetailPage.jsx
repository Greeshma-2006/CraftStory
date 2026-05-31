import React, {
  useState,
  useEffect
} from 'react';

import {
  useParams,
  Link,
  useNavigate
} from 'react-router-dom';

import { storyService } from '../services';

import { formatDate } from '../utils/helpers';

import {
  ArrowLeft,
  User,
  Eye,
  BookOpen
} from 'lucide-react';

import { toast } from 'sonner';

const StoryDetailPage = () => {

  const { id } = useParams();

  const navigate = useNavigate();

  const [story, setStory] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    storyService
      .getOne(id)

      .then(res =>
        setStory(res.data.data)
      )

      .catch(() => {

        toast.error(
          'Story not found'
        );

        navigate('/stories');

      })

      .finally(() =>
        setLoading(false)
      );

  }, [id]);

  if (loading) {

    return (

      <div className="min-h-screen bg-cream flex items-center justify-center">

        <div className="loading-shimmer w-20 h-20 rounded-full" />

      </div>

    );
  }

  if (!story) return null;

  return (

    <div className="min-h-screen bg-cream">

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <Link
          to="/stories"
          className="flex items-center gap-2 text-neutral-600 hover:text-terracotta mb-8 transition-colors"
        >

          <ArrowLeft className="w-4 h-4" />

          All CraftStories

        </Link>

        <article>

          <div className="mb-8">

            <div className="badge-craft inline-flex items-center gap-2 mb-4">

              <BookOpen className="w-3 h-3" />

              CraftStory

            </div>

            <h1 className="font-heading text-5xl font-semibold text-neutral-900 mb-6 leading-tight">
              {story.title}
            </h1>

          </div>

        </article>

      </div>

    </div>

  );
};

export default StoryDetailPage;
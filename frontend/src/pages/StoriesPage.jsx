import React, {
  useState,
  useEffect
} from 'react';

import { Link } from 'react-router-dom';

import { storyService } from '../services';

import {
  formatDate,
  truncateText
} from '../utils/helpers';

import {
  BookOpen,
  User,
  Eye
} from 'lucide-react';

import { toast } from 'sonner';

const StoriesPage = () => {

  const [stories, setStories] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    storyService
      .getAll()

      .then(res =>
        setStories(
          res.data.data || []
        )
      )

      .catch(() =>
        toast.error(
          'Failed to load stories'
        )
      )

      .finally(() =>
        setLoading(false)
      );

  }, []);

  if (loading) {

    return (

      <div className="min-h-screen bg-cream">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {[...Array(6)].map((_, i) => (

              <div
                key={i}
                className="card-craft overflow-hidden"
              >

                <div className="loading-shimmer h-48" />

                <div className="p-5 space-y-3">

                  <div className="loading-shimmer h-5 rounded w-3/4" />

                  <div className="loading-shimmer h-4 rounded w-full" />

                  <div className="loading-shimmer h-4 rounded w-2/3" />

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    );
  }

  return (

    <div className="min-h-screen bg-cream">

      <div className="bg-white border-b border-neutral-200 py-14">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          <div className="inline-flex items-center gap-2 badge-craft mb-4">

            <BookOpen className="w-4 h-4" />

            Artisan Stories

          </div>

          <h1 className="font-heading text-5xl font-semibold text-neutral-900 mb-4">
            CraftStories
          </h1>

          <p className="text-neutral-600 text-lg max-w-2xl mx-auto">
            Every artisan has a story.
            Discover the passion,
            heritage, and craft behind
            every handmade creation.
          </p>

        </div>

      </div>

    </div>

  );
};

export default StoriesPage;
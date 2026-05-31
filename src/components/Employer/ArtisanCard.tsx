import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BadgeCheck, Calendar, Eye, Star } from 'lucide-react';
import StarRating from '../common/StarRating';
import { parseRating, parseReviewCount } from '../../utils/starRatingUtils';
import { hasUsableAvatarUrl, resolveMediaUrl } from '../../utils/avatarUrl';

export interface ArtisanCardData {
  id: number;
  first_name: string;
  last_name: string;
  avatar: string | null;
  address: string | null;
  dob: string | null;
  status: number;
  is_verified?: number | boolean;
  average_rating: number | string | null;
  total_reviews?: number | string | null;
  is_employed: boolean;
  occupations: { name: string }[];
}

const getInitials = (first: string, last: string) =>
  `${first?.charAt(0) ?? ''}${last?.charAt(0) ?? ''}`.toUpperCase();

const getOccupation = (artisan: ArtisanCardData): string => {
  if (artisan.occupations?.length) {
    const name = artisan.occupations[0].name;
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
  return 'Professional';
};

const getAge = (dob: string | null): string | null => {
  if (!dob) return null;
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return `${age} yrs old`;
};

const isVerified = (artisan: ArtisanCardData) =>
  artisan.status === 1 ||
  artisan.is_verified === 1 ||
  artisan.is_verified === true;

interface ArtisanCardProps {
  artisan: ArtisanCardData;
}

const ArtisanThumb: React.FC<{
  avatar: string | null;
  firstName: string;
  lastName: string;
}> = ({ avatar, firstName, lastName }) => {
  const [failed, setFailed] = useState(false);
  const imageUrl = resolveMediaUrl(avatar);
  const showImage = Boolean(imageUrl) && !failed;
  const initials = getInitials(firstName, lastName);

  if (showImage && imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={`${firstName} ${lastName}`}
        className="h-20 w-[72px] rounded-xl object-cover sm:h-[88px] sm:w-20"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div className="flex h-20 w-[72px] items-center justify-center rounded-xl bg-gradient-to-br from-[#DFF3E8] to-[#B8DFC8] sm:h-[88px] sm:w-20">
      <span className="text-xl font-extrabold text-green-800 sm:text-2xl">
        {initials || '?'}
      </span>
    </div>
  );
};

const ArtisanCard: React.FC<ArtisanCardProps> = ({ artisan }) => {
  const rating = parseRating(artisan.average_rating);
  const reviewCount = parseReviewCount(artisan.total_reviews);
  const hasReviews = rating > 0;
  const profileUrl = `/employer/artisan/profile?id=${artisan.id}`;
  const ageLine = getAge(artisan.dob);
  const addressLine = artisan.address?.trim() || null;

  return (
    <article className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800 sm:p-4">
      {(artisan.is_employed || isVerified(artisan)) && (
        <div className="mb-2 flex items-center gap-2">
          {artisan.is_employed && (
            <span className="inline-flex shrink-0 items-center rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-white">
              HIRED
            </span>
          )}
          <div className="ml-auto flex shrink-0 items-center gap-1.5">
            {isVerified(artisan) && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-green-700 dark:text-green-400">
                <BadgeCheck className="h-3 w-3" />
                Verified
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-1 gap-3">
        <div className="shrink-0">
          <ArtisanThumb
            avatar={hasUsableAvatarUrl(artisan.avatar) ? artisan.avatar : null}
            firstName={artisan.first_name}
            lastName={artisan.last_name}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <span className="inline-flex max-w-full truncate rounded-md bg-[#EBE8E4] px-2 py-0.5 text-[10px] font-bold text-gray-900 dark:bg-gray-700 dark:text-gray-100">
              {getOccupation(artisan)}
            </span>
            {hasReviews && (
              <span className="inline-flex shrink-0 items-center gap-0.5 text-xs font-extrabold text-gray-900 dark:text-gray-100">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                {rating.toFixed(1)}
              </span>
            )}
          </div>

          <h3 className="mt-1.5 line-clamp-1 text-sm font-extrabold text-gray-900 dark:text-gray-100 sm:text-[15px]">
            {artisan.first_name} {artisan.last_name}
          </h3>

          {addressLine && (
            <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-gray-500 dark:text-gray-400">
              {addressLine}
            </p>
          )}

          {ageLine && (
            <p className="mt-0.5 text-[11px] font-semibold text-gray-800 dark:text-gray-200">
              {ageLine}
            </p>
          )}

          <div className="mt-1.5">
            {hasReviews ? (
              <>
                <StarRating rating={rating} size={13} />
                <p className="mt-0.5 text-[10px] text-gray-500 dark:text-gray-400">
                  {rating.toFixed(1)} ({reviewCount} review
                  {reviewCount === 1 ? '' : 's'})
                </p>
              </>
            ) : (
              <p className="text-[10px] text-gray-500 dark:text-gray-400">
                No reviews yet
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <Link to={profileUrl} className="min-w-0">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-1 rounded-[10px] bg-[#EBE8E4] px-2 py-2 text-[11px] font-bold text-gray-900 transition-colors hover:bg-[#E0DCD6] dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 sm:gap-1.5 sm:px-3 sm:py-2.5 sm:text-xs"
          >
            <Eye className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
            <span className="truncate">View Profile</span>
          </button>
        </Link>

        {artisan.is_employed ? (
          <div className="group relative min-w-0">
            <button
              type="button"
              disabled
              aria-label="Hire Now unavailable — artisan is already hired"
              className="flex w-full cursor-not-allowed items-center justify-center gap-1 rounded-[10px] bg-gray-200 px-2 py-2 text-[11px] font-bold text-gray-400 dark:bg-gray-700 dark:text-gray-500 sm:gap-1.5 sm:px-3 sm:py-2.5 sm:text-xs"
            >
              <Calendar className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
              <span className="truncate">Hire Now</span>
            </button>
            <span
              role="tooltip"
              className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2.5 py-1.5 text-[11px] font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 dark:bg-gray-700"
            >
              Already hired — unavailable
              <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
            </span>
          </div>
        ) : (
          <Link to={profileUrl} className="min-w-0">
            <button
              type="button"
              className="flex w-full items-center justify-center gap-1 rounded-[10px] bg-green-800 px-2 py-2 text-[11px] font-bold text-white transition-colors hover:bg-green-900 sm:gap-1.5 sm:px-3 sm:py-2.5 sm:text-xs"
            >
              <Calendar className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
              <span className="truncate">Hire Now</span>
            </button>
          </Link>
        )}
      </div>
    </article>
  );
};

export default ArtisanCard;

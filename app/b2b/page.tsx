import { Hero } from '@/components/hero';
import { MailIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function B2B() {
  return (
    <>
      <Hero title="Baseline To Baseline" />
      <div className="flex flex-col sm:flex-row-reverse gap-10 items-center">
        <div className="flex flex-col gap-4 items-center sm:items-start">
          <h2 className="flex flex-col text-center sm:text-left">
            <span className="text-xs text-gray-500 uppercase">
              Clubs & organizations
            </span>
            <span className="font-semibold text-xl lg:text-2xl">
              Working with teams who want to take their game to the next level
            </span>
          </h2>
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ut eius
            iste, nulla fuga ad, voluptate atque quibusdam recusandae facilis
            error eos voluptates, rerum est ex accusamus quos sit hic! Aperiam.
          </p>
        </div>
        <Image
          className="aspect-[9/16] w-full sm:w-auto sm:h-[400px] border rounded-lg shadow-sm"
          src={'/thumbnails/3.webp'}
          width={1000}
          height={1778}
          alt="Tactical board of Pass & Cut drill (5 out)"
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-10 items-center">
        <div className="flex flex-col gap-4 items-center sm:items-start">
          <h2 className="flex flex-col text-center sm:text-left">
            <span className="text-xs text-gray-500 uppercase">
              Custom animations
            </span>
            <span className="font-semibold text-xl lg:text-2xl">
              Help your team with custom animations of your own drills and plays
            </span>
          </h2>
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ut eius
            iste, nulla fuga ad, voluptate atque quibusdam recusandae facilis
            error eos voluptates, rerum est ex accusamus quos sit hic! Aperiam.
          </p>
          <Link
            href="mailto:contact@fullcourt-training.com"
            className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300"
          >
            Contact
            <MailIcon size={16} strokeWidth={1.5} />
          </Link>
        </div>
        <Image
          className="aspect-[9/16] w-full sm:w-auto sm:h-[400px] border rounded-lg shadow-sm"
          src={'/thumbnails/3.webp'}
          width={1000}
          height={1778}
          alt="Tactical board of Pass & Cut drill (5 out)"
        />
      </div>
    </>
  );
}

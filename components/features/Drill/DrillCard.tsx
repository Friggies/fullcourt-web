import { Drill, HighlightedDrill } from '@/lib/types';
import { UsersIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function DrillCard({
  drill,
}: {
  drill: Drill | HighlightedDrill;
}) {
  return (
    <li className="relative">
      <div className="z-10 absolute top-2 right-2 inline-flex items-center gap-1 rounded-md bg-background/60 backdrop-blur-sm px-3 py-1 text-xs text-foreground shadow">
        <UsersIcon size={12} />
        {drill.players} players
      </div>
      <Link
        href={`/drills/${drill.id}`}
        className="relative block overflow-hidden rounded-md border shadow-sm"
      >
        <div className="relative w-full aspect-[9/16] bg-muted">
          <Image
            src={`https://crbswbfgtbkjinzagblg.supabase.co/storage/v1/object/public/drill_thumbnails/${
              drill.id
            }.webp`}
            alt={`${drill.name} preview`}
            fill
            className="object-cover"
            sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
            placeholder="blur"
            blurDataURL="data:image/webp;base64,UklGRpoEAABXRUJQVlA4II4EAABQRACdASoOAeABP/3+/3+/uz+7orSZ+/A/iWVu4H4Cqfdk1GS1jrMgaGgrRbCWhFGi0gs6ns35Cz4tILOHRJYqKNFpBZuRSVzkSGvO0SMElGukDkSGN9Hfv4iqbGmVUMmvU4oblCT2CLTYsITq9NrFr5W4dV5zwyqJL3tw/9qaFlqNLNDIHQSF9XJHx8EEy4pkqCr9f7cwVqQWe07UEC9ehuPGg0xI4Xr2LRDdx1Yv2L6jKhVaZmzAwwlOiXfcc5qayE7UozXNh68ipbo1HLhmjkCzyqBfzCiuf/9Q3PLAi97jKN+GlSFMr+VBRMo4VrWd5BO0MwlrDL2AQURVCZ1JMc026gOgpmJei7/vmlRfZCsipLyW0AAN1dBV76U3jK7JWgwFZgyvH8nC0z7wNhWESjljKy33ZXU4c023XWioVNfXERg8WILGR9THm9gIUg+P8h+m5phlDh7pLq6+Np4IRG2Q2PkU+6x9NCERYZlv1+hPAG6nzLRUXCXPTOkgiOvVXK5KekFRy4l1fDvLmitydnuwMkcButilDUNLjFYkHsX6MpeEcuCVjATBO8b7HJ2EqPYkijfrRjoH1dJMBsbZ4sOH0UwzJ2oMKqYPUyj5woCXPSQPKsNc9HozTKH6FKVif5yH+pCnaVQUuMTmiEUZRaxVKCAgO8zt4sL2s2Az1Q1utmnalGEVvEdBPL9IRdroloRRotIlhSGr1zh0SUJyC2UFOoeYJQnIJYAA/rv2uKdtT8IULmc8VLD251sWmHuwMjfEDaNaVpe8Gil4wr8TsAATmaPZpeWi7leJuYn1Wr4IIdHFReeq22SKEZE9CjBMdc9rMVI01bBhoOZ2fyV6XlgKTLFPJFzLiHQ2iCZJ2FU8jbC86q2nS8RK1FwYsOyI47E0FVztf/Qac8YfeRIs/ivY629TCE4Q+9OHx2QpHhQAdDWyK8Wba2HV4xb/Siog9OYr5kvVS6xnDPcgJboASNvOPDpIM0ggXEotOo1DcNLf/BebPISSUOF+aLU3egNLeASEkORzmD2AqAbutHp3+IxGVCVNpua+3ne54Qq3w5DA3g1xJjqoReJlMNJcIDWBf4yLrEXn1T36ANZMk3o6k850IBnQwGRnUjcRVCpqldsiEqe//WjQv/9fjOzDtjrxQz4ZoepiLe/rWNacRO6C9Uk/mIYMA/HuEFjJIsMJIYJdrGv9xtBfqSXqc5u45I58C4E53EuRXkOsnDNJQceAoezo2DPPHgRvf9R+f3wRe9WZ9ksybN5ennUCniOvRtojLoUuM9PCJMSlmesVglzh4841ChqCQnL2f0NgPUKcxo0GAvKYVR7USmCH7QL6UBFvJKxVAlP6J3BHL1GDCersUdI4pI4EEDI//uvFenxRS8jbfCxZPXeyAFWr2hIPw8gfFJ38VrVNRnpx/jASqQuJ/fLaRy9yG7abDcq7l7yuyDVIMUPANA078dclTOwmq3LCBIYVZkpc2+gCKWQ19TAFl7ZYOz3DuhsMK2Yvmt4Dmu4Zw7t1JQ7D1Hvb123G2aprAiFBm7wABcE0nGAAAA=="
          />
        </div>

        <div className="absolute bottom-0 w-full bg-background/60 backdrop-blur-sm p-4 flex flex-col">
          <h2 className="text-lg font-semibold">{drill.name}</h2>
          <p className="text-sm">{drill.categories.join(', ')}</p>
        </div>
      </Link>
    </li>
  );
}

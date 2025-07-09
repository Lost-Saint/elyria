import { useState } from 'react';
import type { Fragment } from '@prisma/client';
import { Button } from '~/components/ui/button';
import { ExternalLink, RefreshCcwIcon } from 'lucide-react';
import { Hint } from '~/components/hints';

interface Props {
  data: Fragment;
}

export const FragmentWeb = ({ data }: Props) => {
  const [copied, setCopied] = useState(false);
  const [fragmentKey, setFragmentKey] = useState(0);

  const onRefresh = () => {
    setFragmentKey((prev) => prev + 1);
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(data.sandboxUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        console.warn('Failed to copy to clipboard');
      });
  };
  return (
    <div className="flex h-full w-full flex-col">
      <div className="bg-sidebar flex items-center gap-x-2 border-b p-2">
        <Hint text="Refresh" side="bottom" align="start">
          <Button size="sm" variant="outline" onClick={onRefresh} aria-label="Refresh iframe">
            <RefreshCcwIcon />
          </Button>
        </Hint>
        <Hint text="Click to copy" side="bottom">
          <Button
            className="flex-1 justify-start text-start font-normal"
            size="sm"
            variant="outline"
            disabled={!data.sandboxUrl || copied}
            onClick={handleCopy}
            aria-label={copied ? 'URL copied' : 'Copy URL'}
          >
            <span className="truncate">{data.sandboxUrl}</span>
          </Button>
        </Hint>
        <Hint text="Open in new tab" side="bottom" align="start">
          <Button
            size="sm"
            variant="outline"
            disabled={!data.sandboxUrl}
            onClick={() => {
              if (!data.sandboxUrl) return;
              window.open(data.sandboxUrl, '_blank', 'noopener,noreferrer');
            }}
            aria-label="Open in new tab"
          >
            <ExternalLink />
          </Button>
        </Hint>
      </div>
      <iframe
        title={`Fragment preview: ${data.title ?? data.id}`}
        aria-label="Fragment preview"
        key={fragmentKey}
        className="h-full w-full"
        sandbox="allow-forms allow-scripts allow-same-origin"
        loading="lazy"
        src={data.sandboxUrl}
      />
    </div>
  );
};

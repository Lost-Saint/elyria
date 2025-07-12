import { useState } from 'react';
import { Hint } from './hints';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './ui/resizable';
import { Button } from './ui/button';
import { CopyIcon } from 'lucide-react';
import { CodeView } from './code-view';

type FileCollection = Record<string, string>;

function getLanguageFromExtension(filename: string): string {
  const extension = filename.split('.').pop()?.toLowerCase();
  return extension ?? 'text';
}

interface FileExporerProps {
  files: FileCollection;
}

export const FileExporer = ({ files }: FileExporerProps) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(() => {
    const fileKeys = Object.keys(files);
    return fileKeys.length > 0 ? fileKeys[0] : null;
  });
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={30} minSize={30} className="bg-sidebar">
        <TreeView data={[]} value={selectedFile} onSelect={} />
      </ResizablePanel>
      <ResizableHandle className="hover:bg-primary transition-colors" />
      <ResizablePanel defaultSize={70} minSize={50}>
        {selectedFile && files[selectedFile] ? (
          <div className="flex h-full w-full flex-col">
            <div className="bg-sidebar flex items-center justify-between gap-x-2 border-b px-2 py-2">
              {/* TODO: file breadcrumb */}
              <Hint text="Copy to clipboard" side="bottom">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={false}
                  className="ml-auto"
                  onClick={() => {}}
                >
                  <CopyIcon />
                </Button>
              </Hint>
            </div>
            <div className="flex-1 overflow-auto">
              <CodeView code={files[selectedFile]} lang={getLanguageFromExtension(selectedFile)} />
            </div>
          </div>
        ) : (
          <div className="text-muted-foreground flex h-full items-center justify-center">
            Select a file to view it&apos;s content
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

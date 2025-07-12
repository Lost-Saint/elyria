import { Fragment, useCallback, useMemo, useState } from 'react';
import { Hint } from './hints';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './ui/resizable';
import { Button } from './ui/button';
import { CopyIcon } from 'lucide-react';
import { CodeView } from './code-view';
import { convertFilesToTreeItems } from '~/lib/utils';
import { TreeView } from './tree-view';
import { BreadcrumbItem, BreadcrumbPage, BreadcrumbSeparator } from './ui/breadcrumb';

type FileCollection = Record<string, string>;

function getLanguageFromExtension(filename: string): string {
  const extension = filename.split('.').pop()?.toLowerCase();
  return extension ?? 'text';
}

interface FileBreadCrumbProps {
  filePath: string;
}
const FileBreadCrumb = ({ filePath }: FileBreadCrumbProps) => {
  const pathSegments = filePath.split('/');
  const maxSegments = 4;

  const renderBreadCrumbItems = () => {
    if (pathSegments.length <= maxSegments) {
      // show all segments or less
      return pathSegments.map((segment, index) => {
        const isLast = index === pathSegments.length - 1;
        return (
          <Fragment key={index}>
            <BreadcrumbItem>
              {isLast ? (
                <BreadcrumbPage className="font-medium">{segment}</BreadcrumbPage>
              ) : (
                <span className="text-muted-foreground">{segment}</span>
              )}
            </BreadcrumbItem>
            {!isLast && <BreadcrumbSeparator />}
          </Fragment>
        );
      });
    } else {
    }
  };
};

interface FileExporerProps {
  files: FileCollection;
}

export const FileExporer = ({ files }: FileExporerProps) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(() => {
    const fileKeys = Object.keys(files);
    return fileKeys.length > 0 ? (fileKeys[0] ?? null) : null;
  });

  const treeData = useMemo(() => {
    return convertFilesToTreeItems(files);
  }, [files]);

  const handleFileSelect = useCallback(
    (filePath: string) => {
      if (files[filePath]) {
        setSelectedFile(filePath);
      }
    },
    [files],
  );

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={30} minSize={30} className="bg-sidebar">
        <TreeView data={treeData} value={selectedFile} onSelect={handleFileSelect} />
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
                  onClick={() => {
                    /* */
                  }}
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

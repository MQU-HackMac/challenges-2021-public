import "../styles/SelectedFileList.module.css";

interface SelectedFileListProps {
  selectedFiles: Array<File>;
}

export const SelectedFileList: React.FC<SelectedFileListProps> = ({
  selectedFiles,
}) => {
  return (
    <div className="py-4">
      {selectedFiles.map((file, i) => (
        <p key={i} className="list-none text-white font-bold text-center">
          {file.name}
        </p>
      ))}
    </div>
  );
};

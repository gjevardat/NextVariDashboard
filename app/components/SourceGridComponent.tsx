import { run, source } from "../types";
import Pagination from "./PaginationComponent";
import { TimeSeries } from "./TimeSeriesChart";

interface GridProps {
  run : run|null,
  sources: source[] | null,
  columns: number,
  rows: number,
  pageIndex: number,
  setPageIndex: (pageIndex: number) => void,

}

export const SourceGrid: React.FC<GridProps> = ({ run, sources, columns, rows, pageIndex, setPageIndex }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`, // Fixed columns
        gridTemplateRows: `repeat(${rows}, 1fr)`,       // Fixed rows
        gap: '2px', // Space between grid items
        height: '100%', // Ensure grid does not expand indefinitely
        width: '100%',
        overflow: 'hidden', // Prevent overflow issues
      }}
    >
      {sources && Array.from({ length: sources.length }, (_, index) => {
        const source = sources[index];

        // If no source exists at this index, return an empty cell
        if (!source) {
          return <div key={index} style={{ border: '1px solid #ccc' }} />;
        }

        // Render the source component
        return (
          <div
            key={source.sourceid}
            style={{
              border: '1px solid #ccc', // Example styling, adjust as needed
              padding: '10px',
              height: '100%',
              overflow: 'hidden'
            }}
          >
            <h4><b>{source.sourceid}</b></h4>
            <TimeSeries source={sources ? source : null} />
          </div>
        );
      })}

       {sources && <Pagination

        currentPageIndex={pageIndex}
        totalItems={run?run.size:0}
        itemsPerPage={columns*rows}
        onPageChange={setPageIndex} // Update page state
      />}

    </div>
  );
};


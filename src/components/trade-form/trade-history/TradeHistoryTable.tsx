
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Maximize2, Image, Pencil } from "lucide-react";
import { Trade } from "@/types/trade";
import { useToast } from "@/hooks/use-toast";
import { TradeRow } from "./TradeRow";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface TradeHistoryTableProps {
  trades: Trade[];
  onEdit: (trade: Trade) => void;
  onDelete: (id: string) => void;
  onViewDetails: (trade: Trade) => void;
  showEditButton?: boolean;
}

export function TradeHistoryTable({ 
  trades, 
  onEdit, 
  onDelete, 
  onViewDetails, 
  showEditButton = false 
}: TradeHistoryTableProps) {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleDelete = async (id: string) => {
    try {
      // Call the parent's onDelete function
      onDelete(id);
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: "Failed to delete trade",
        variant: "destructive"
      });
    }
  };

  // Calculate pagination values
  const totalPages = Math.ceil(trades.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTrades = trades.slice(indexOfFirstItem, indexOfLastItem);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // If we have less pages than max, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always include first and last page
      pages.push(1);
      
      // Calculate middle pages to show
      let middleStart = Math.max(2, currentPage - 1);
      let middleEnd = Math.min(currentPage + 1, totalPages - 1);
      
      // Adjust if we're near the beginning or end
      if (currentPage <= 3) {
        middleEnd = Math.min(maxPagesToShow - 1, totalPages - 1);
      } else if (currentPage >= totalPages - 2) {
        middleStart = Math.max(2, totalPages - maxPagesToShow + 2);
      }
      
      // Add ellipsis before middle section if needed
      if (middleStart > 2) {
        pages.push("ellipsis-start");
      }
      
      // Add middle pages
      for (let i = middleStart; i <= middleEnd; i++) {
        pages.push(i);
      }
      
      // Add ellipsis after middle section if needed
      if (middleEnd < totalPages - 1) {
        pages.push("ellipsis-end");
      }
      
      // Add last page if we're not already including it
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Symbol</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Entry</TableHead>
              <TableHead>Exit</TableHead>
              <TableHead>P/L</TableHead>
              <TableHead>Outcome</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentTrades.length > 0 ? (
              currentTrades.map((trade) => (
                <TradeRow 
                  key={trade.id}
                  trade={trade}
                  onEdit={onEdit}
                  onDelete={handleDelete}
                  onViewDetails={onViewDetails}
                  showEditButton={showEditButton}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6">
                  No trades match your filters
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {trades.length > itemsPerPage && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => handlePageChange(currentPage - 1)} 
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            
            {getPageNumbers().map((page, index) => (
              typeof page === "number" ? (
                <PaginationItem key={index}>
                  <PaginationLink 
                    onClick={() => handlePageChange(page)} 
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ) : (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              )
            ))}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => handlePageChange(currentPage + 1)} 
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}

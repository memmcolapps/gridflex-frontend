"use client";

import * as React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface PaginationControlsProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: number[];
  className?: string;
  showPageSizeSelector?: boolean;
  showRange?: boolean;
  rowsPerPageLabel?: string;
  zeroBasedIndexing?: boolean;
}

export function PaginationControls({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
  className = "",
  showPageSizeSelector = true,
  showRange = true,
  rowsPerPageLabel = "Rows per page",
  zeroBasedIndexing = false,
}: PaginationControlsProps) {
  const normalizedPage = zeroBasedIndexing ? currentPage + 1 : currentPage;

  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const isFirstPage = normalizedPage === 1;
  const isLastPage = normalizedPage === totalPages || totalPages === 0;
  const startIndex = totalItems > 0 ? (normalizedPage - 1) * pageSize + 1 : 0;
  const endIndex = Math.min(normalizedPage * pageSize, totalItems);

  const handlePrevious = () => {
    if (!isFirstPage) {
      const newPage = normalizedPage - 1;
      onPageChange(zeroBasedIndexing ? newPage - 1 : newPage);
    }
  };

  const handleNext = () => {
    if (!isLastPage) {
      const newPage = normalizedPage + 1;
      onPageChange(zeroBasedIndexing ? newPage - 1 : newPage);
    }
  };

  const handlePageSizeChange = (value: string) => {
    const newPageSize = Number(value);
    onPageSizeChange(newPageSize);
    onPageChange(zeroBasedIndexing ? 0 : 1);
  };

  return (
    <Pagination
      className={`mt-4 flex items-center justify-between ${className}`}
    >
      {showPageSizeSelector && (
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">{rowsPerPageLabel}</span>
          <Select
            value={pageSize.toString()}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize.toString()} />
            </SelectTrigger>
            <SelectContent
              position="popper"
              side="top"
              align="center"
              className="mb-1 ring-gray-50"
            >
              {pageSizeOptions.map((option) => (
                <SelectItem key={option} value={option.toString()}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {showRange && (
            <span className="text-sm font-medium">
              {startIndex}-{endIndex} of {totalItems}
            </span>
          )}
        </div>
      )}
      {!showPageSizeSelector && showRange && (
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">
            {startIndex}-{endIndex} of {totalItems}
          </span>
        </div>
      )}
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePrevious();
            }}
            aria-disabled={isFirstPage}
            className={isFirstPage ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleNext();
            }}
            aria-disabled={isLastPage}
            className={isLastPage ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

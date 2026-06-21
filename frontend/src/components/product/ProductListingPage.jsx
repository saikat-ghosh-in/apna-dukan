import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MdSearch, MdClose, MdTune, MdKeyboardArrowDown } from "react-icons/md";
import { fetchProducts } from "../../reduxStore/actions/productActions";
import { fetchCategories } from "../../reduxStore/actions/categoryActions";
import { fetchSellers } from "../../reduxStore/actions/sellerActions";
import { useSubHeader } from "../shared/SubHeaderContext";
import { formatCurrency } from "../../utils/formatCurrency";
import ProductCard, { CardSkeleton } from "./ProductCard";
import FilterPanel from "./FilterPanel";
import Pagination from "./Pagination";
import { SORT_OPTIONS, buildQueryString, parseParams, countActiveFilters } from "../../utils/productUtils";

const ProductListingPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const { setSubHeader } = useSubHeader();
    const searchDebounce = useRef(null);
    const searchRef = useRef(null);

    const products = useSelector(state => state.products.products);
    const pagination = useSelector(state => state.products.pagination);
    const isFetching = useSelector(state => state.status.isLoading);
    const categories = useSelector(state => state.categories.categories);
    const sellers = useSelector(state => state.sellers.sellers);

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [searchInput, setSearchInput] = useState(searchParams.get("keyword") || "");

    const closeDrawer = useCallback(() => setDrawerOpen(false), []);

    const filters = parseParams(searchParams);
    const { sortBy, sortingOrder, category, sellers: selectedSellers, minPrice, maxPrice, inStockOnly } = filters;
    const activeFilterCount = countActiveFilters(filters);
    const currentSortLabel = SORT_OPTIONS.find(o => o.sortBy === sortBy && o.sortingOrder === sortingOrder)?.label ?? "Newest First";

    const setParam = (updates) => {
        const next = new URLSearchParams(searchParams);
        Object.entries(updates).forEach(([k, v]) => {
            if (v === "" || v === null || v === undefined) next.delete(k);
            else next.set(k, String(v));
        });
        if (!("pageNumber" in updates)) next.set("pageNumber", "0");
        setSearchParams(next);
    };

    const clearAllFilters = () => {
        setSearchInput("");
        const newParams = new URLSearchParams();
        if (sortBy) newParams.set("sortBy", sortBy);
        if (sortingOrder) newParams.set("sortingOrder", sortingOrder);
        newParams.set("pageNumber", "0");
        setSearchParams(newParams);
    };

    const removeSeller = (sellerName) => {
        const next = selectedSellers.filter(s => s !== sellerName);
        setParam({ sellers: next.length ? next.join(",") : "" });
    };

    useEffect(() => {
        dispatch(fetchProducts(buildQueryString(filters)));
    }, [searchParams.toString()]);

    useEffect(() => {
        if (!categories?.length) dispatch(fetchCategories());
        if (!sellers?.length) dispatch(fetchSellers());
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            const tag = document.activeElement?.tagName;
            if (e.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA") {
                e.preventDefault();
                searchRef.current?.focus();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    useEffect(() => {
        setSubHeader(
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-gray-400 shrink-0">
                    <span className="hover:text-blue-500 cursor-pointer transition-colors" onClick={() => navigate("/")}>Home</span>
                    <span>/</span>
                    <span className="font-semibold text-gray-700">Products</span>
                    {category && <><span>/</span><span className="font-semibold text-gray-700">{category}</span></>}
                </div>

                {/* Centered search */}
                <div className="relative w-full max-w-sm">
                    <MdSearch size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                        ref={searchRef}
                        type="text"
                        placeholder="Search products..."
                        value={searchInput}
                        onChange={handleSearchChange}
                        onFocus={() => searchRef.current?.select()}
                        className="w-full pl-8 pr-14 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 transition-all"
                    />
                    {searchInput
                        ? <button onClick={clearSearch} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                            <MdClose size={12} />
                        </button>
                        : <kbd className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-gray-400 bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded pointer-events-none">
                            /
                        </kbd>
                    }
                </div>

                <button
                    onClick={() => setDrawerOpen(true)}
                    className="lg:hidden relative flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-700 font-medium hover:border-blue-300 transition-colors cursor-pointer shrink-0"
                >
                    <MdTune size={14} /> Filters
                    {activeFilterCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 h-4 w-4 flex items-center justify-center text-[10px] font-bold bg-blue-500 text-white rounded-full">
                            {activeFilterCount}
                        </span>
                    )}
                </button>
            </div>
        );
        return () => setSubHeader(null);
    }, [searchInput, category, activeFilterCount]);

    const handleSearchChange = (e) => {
        const val = e.target.value;
        setSearchInput(val);
        clearTimeout(searchDebounce.current);
        searchDebounce.current = setTimeout(() => setParam({ keyword: val }), 400);
    };

    const clearSearch = () => { setSearchInput(""); setParam({ keyword: "" }); };

    const filterProps = { categories, sellers, filters, setParam, clearAllFilters, activeFilterCount };

    const hasActiveFilters = category || selectedSellers?.length || minPrice || maxPrice || inStockOnly;

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

                {/* Active filter chips */}
                {hasActiveFilters && (
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                        <span className="text-xs text-gray-400 font-medium">Active:</span>

                        {category && (
                            <Chip label={category} onRemove={() => setParam({ category: "" })} />
                        )}

                        {/* One chip per selected seller */}
                        {selectedSellers?.map(s => (
                            <Chip key={s} label={s} onRemove={() => removeSeller(s)} />
                        ))}

                        {(minPrice || maxPrice) && (
                            <Chip
                                label={`${formatCurrency(minPrice || 0)} – ${maxPrice ? formatCurrency(maxPrice) : "Any"}`}
                                onRemove={() => setParam({ minPrice: "", maxPrice: "" })}
                            />
                        )}

                        {inStockOnly && (
                            <Chip label="In Stock" green onRemove={() => setParam({ inStock: "" })} />
                        )}
                    </div>
                )}

                <div className="flex gap-6 items-start">
                    <FilterPanel {...filterProps} />

                    <div className="flex-1 min-w-0">
                        {/* Sort + result count row */}
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm text-gray-500">
                                {isFetching
                                    ? <span className="inline-block h-4 w-32 bg-gray-100 rounded animate-pulse" />
                                    : <>
                                        <span className="font-semibold text-gray-800">{pagination.totalElements ?? 0}</span> product{pagination.totalElements !== 1 ? "s" : ""} found
                                    </>
                                }
                            </p>
                            <div className="relative">
                                <select
                                    value={currentSortLabel}
                                    onChange={e => {
                                        const opt = SORT_OPTIONS.find(o => o.label === e.target.value);
                                        if (opt) setParam({ sortBy: opt.sortBy, sortingOrder: opt.sortingOrder });
                                    }}
                                    className="appearance-none bg-white border border-gray-200 rounded-xl pl-3 pr-8 py-2 text-xs text-gray-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-400 cursor-pointer shadow-sm"
                                >
                                    {SORT_OPTIONS.map(o => <option key={o.label}>{o.label}</option>)}
                                </select>
                                <MdKeyboardArrowDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {isFetching ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                                {Array.from({ length: 12 }).map((_, i) => <CardSkeleton key={i} />)}
                            </div>
                        ) : products.length === 0 ? (
                            <EmptyState hasActiveFilters={hasActiveFilters} onClear={clearAllFilters} />
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                                {products.map(p => (
                                    <ProductCard key={p.productId} product={p} onClick={() => navigate(`/products/${p.productId}`)} />
                                ))}
                            </div>
                        )}

                        {pagination?.totalPages > 0 && (
                            <Pagination
                                pageInfo={pagination}
                                loading={isFetching}
                                onPageChange={p => setParam({ pageNumber: p })}
                            />
                        )}

                    </div>
                </div>
            </div>

            <FilterPanel
                asDrawer
                open={drawerOpen}
                onClose={closeDrawer}
                totalElements={pagination.totalElements ?? 0}
                {...filterProps}
            />
        </div>
    );
};

const Chip = ({ label, onRemove, green }) => (
    <span className={`inline-flex items-center gap-1 text-xs border px-2.5 py-1 rounded-full font-medium ${green ? "bg-green-50 text-green-600 border-green-100" : "bg-blue-50 text-blue-600 border-blue-100"
        }`}>
        {label}
        <MdClose size={11} className="cursor-pointer ml-0.5" onClick={onRemove} />
    </span>
);

const EmptyState = ({ hasActiveFilters, onClear }) => (
    <div className="flex flex-col items-center justify-center py-24 text-center">
        <h3 className="text-base font-bold text-gray-700 mb-1">No products found</h3>
        {hasActiveFilters ? (
            <>
                <p className="text-sm text-gray-400 mb-5">Try adjusting your filters or search term</p>
                <button onClick={onClear} className="text-sm font-semibold text-blue-500 hover:text-blue-700 transition-colors cursor-pointer">
                    Clear all filters
                </button>
            </>
        ) : (
            <div className="mt-2">
                <button onClick={() => window.location.reload()} className="text-sm font-semibold text-blue-500 hover:text-blue-700 transition-colors cursor-pointer">
                    Try again
                </button>
            </div>
        )}
    </div>
);

export default ProductListingPage;
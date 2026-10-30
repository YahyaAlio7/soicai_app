import { getPosts } from './apis/post.api';
import Loading from '../../components/Loading';
import { toast } from 'react-toastify';
import PostItem from '../PostItem';
import type { Post } from '../../interfaces/post.interface';

import { useInfiniteQuery } from '@tanstack/react-query';
import CreatePost from '../Posts/CreatePost';
export default function Feed() {
 
 const {data,isLoading,isError,error,fetchNextPage,hasNextPage,isFetchingNextPage,isFetchNextPageError} =  useInfiniteQuery({
  queryKey:['posts'],
  queryFn : ({pageParam}) => getPosts(pageParam),
  initialPageParam: 1,
  getNextPageParam: (lastPage) => {
    const pagination = lastPage?.meta?.pagination;
    return pagination?.nextPage || (pagination?.currentPage < pagination?.numberOfPages ? pagination.currentPage + 1 : undefined);
  },
  refetchOnWindowFocus:false,
  refetchOnReconnect:false,
 })


 if (isLoading){
  return <Loading></Loading>
 }

 if (isError){
  toast.error(error?.message);
  return <p role="alert" className="p-6 text-center text-red-600">Couldn’t load posts. Please try again.</p>
 }

  return (
    <>
    <CreatePost></CreatePost>
    <div className='flex'>
      <div className='w-1/4'></div>
      <div className='w-2/4'>
      {data?.pages.flatMap((page) => page?.data?.posts ?? []).map((post:Post) => (
        <PostItem key={post._id} posts={post} />
      ))}
      {hasNextPage && <button type="button" onClick={() => fetchNextPage()} disabled={isFetchingNextPage} className="my-4 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white disabled:opacity-50">
        {isFetchingNextPage ? 'Loading more posts…' : 'Load more posts'}
      </button>}
      {isFetchNextPageError && <p role="alert" className="my-3 text-center text-red-600">Couldn’t load more posts. Try again.</p>}
      </div>
      <div className='w-1/4'></div>
    </div>
    </>
  )
}

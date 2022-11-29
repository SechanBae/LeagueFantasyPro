import React from 'react'
import { Button } from 'react-bootstrap';

const Pagination = ({totalPosts,postsPerPage,setCurrentPage,currentPage}) => {
    var pages=[];
    for(let i=1;i<=Math.ceil(totalPosts/postsPerPage);i++){
        pages.push(i);
    }
  return (
    <div className='d-flex justify-content-center'>
         {pages.map((page,index)=>(
            <Button className={page==currentPage?'active':''+' mx-1'} key={index} onClick={()=>setCurrentPage(page)}>{page}</Button>
         ))}
    </div>
  )
}

export default Pagination
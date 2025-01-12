import React from 'react'

const Sidebar = () => {
  const isSupervisor = true;

  const routes = isSupervisor ? [
    '/dashboard',
    '/customers',
    '/colectors',
    '/colectors-payments',
    '/transactions',
    '/transactions-types',
    '/approvals',
    '/users',
    '/audit'
  ] : [
    '/customers',
    '/colectors-payments',
    '/transactions'
  ];

  return (
    <>

    </>
  )
}

export default Sidebar
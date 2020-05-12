const fragments = {
  infoDetail: `
    fragment infoDetail on Info {
      id
    }
  `,
};

export const GET_INFO = `
  query getInfo {
    info {
      ...infoDetail
    }
  }
  ${fragments.infoDetail}
`;

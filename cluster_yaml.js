import * as param from '@jkcfg/std/param'
import * as std from '@jkcfg/std'

const config = param.all();
let output = [];


let cluster = {
  apiVersion: "cluster.k8s.io/v1alpha1",
  kind: "Cluster",
  metadata: {
    name: "example",
    namespace: "weavek8sops",
  },
  spec: {
    clusterNetwork: {
      services: {
        cidrBlocks: ["10.96.0.0/12"],
      },
      pods: {
        cidrBlocks: ["192.168.0.0/16"],
      },
      serviceDomain: "cluster.local",
    },
    providerSpec: {
      value: {
        apiVersion: "baremetalproviderspec/v1alpha1",
        kind: "BareMetalClusterProviderSpec",
        user: "root",
        os: {
          files: [{
            source: {
              configmap: "repo",
              key: "kubernetes.repo",
            },
            destination: "/etc/yum.repos.d/kubernetes.repo",
          },
          {
            source: {
              configmap: "repo",
              key: "docker-ce.repo",
            },
            destination: "/etc/yum.repos.d/docker-ce.repo",
          },
          {
            source: {
              configmap: "docker",
              key: "daemon.json",
            },
            destination: "/etc/docker/daemon.json",
          }]
        },
        cri: {
          kind: "docker",
          package: "docker-ce",
          version: "18.09.7",
        },
      }
    }
  }
}

if (config.externalLoadBalancer !== undefined) {
  cluster.spec.providerSpec.value.apiServer = {
    externalLoadBalancer: `${config.externalLoadBalancer}`
  };
}

output.push({ path: 'cluster.yaml', value: cluster});

export default output;

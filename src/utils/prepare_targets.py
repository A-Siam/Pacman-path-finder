from models.graph import Graph
from algorithms.A_star import path_to_distance, parent_list_to_path

def prepare_targets(maze_map, starting_node_id):
    visited_nodes = set()
    graph = maze_map.graph
    
    adjacency_dict = graph.get_adjacency_dict()
    nodes_queue = [starting_node_id]
    node_parent = {starting_node_id: None}  # node_id:parent_id

    res = {} # dict[node_id, List[Nodes]]
    while len(nodes_queue):
        node = nodes_queue.pop(0)  # remove the first element, FIFO
        if node not in visited_nodes:
            visited_nodes.add(node)
            if not graph.nodes[node].is_target():    
                connections = adjacency_dict.get(node)
                if connections:
                    for connection in connections:
                        # add the to index to nodes queue
                        nodes_queue.append(connection[0])
                        if connection[0] not in visited_nodes:
                            node_parent[connection[0]] = node

            else :
                res[node] = parent_list_to_path(node_parent, node)


    res_cost = res
    for k in res_cost.keys():
        path_ids = res_cost[k]
        path = [maze_map.graph.nodes[id_] for id_ in path_ids]
        distance = path_to_distance(path)
        res_cost[k] = distance

    return res_cost
